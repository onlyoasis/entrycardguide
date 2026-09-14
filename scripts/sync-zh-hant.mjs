#!/usr/bin/env node
// One-command repeatable Simplified→Traditional content sync.
//
//   node scripts/sync-zh-hant.mjs [--check]
//
// For every content/**/*.zh.md this (re)generates the sibling .zh-hant.md:
// - front matter: prose values (title/kicker/description/faq/keywords…) are
//   converted; machine keys (url/slug/aliases/date/lastmod/weight/country…) and
//   alias paths are NEVER touched, so verification dates and old alias targets
//   survive a re-run byte-identically. Block scalars / unsupported YAML shapes
//   throw instead of silently leaking Simplified.
// - body: fenced code blocks, inline code, link destinations, HTML attributes
//   and shortcode params are protected; visible prose is converted via
//   scripts/zh-hant/core.mjs.
// - links: same-file `](#anchor)` slugs are remapped to converted headings;
//   in-site /zh/… and English-route links are rewritten to /zh-hant/… with
//   route existence enforced — a link that cannot be mapped fails the run
//   instead of silently pointing at the wrong language.
//
// --check: verify .zh-hant.md files are up to date (exit 1 on drift) without
// writing — wire into maintenance so stale translations are caught.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  convertMarkdownBody,
  convertFrontMatterLine,
  splitFrontMatter,
  remapAnchors,
  remapInternalLinks,
} from "./zh-hant/core.mjs";
import { runSelftest } from "./zh-hant/selftest.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
// CONTENT_ROOT is a test hook only (isolated fixture runs); production always
// syncs the real content/ tree.
const CONTENT = process.env.CONTENT_ROOT ? path.resolve(process.env.CONTENT_ROOT) : path.join(ROOT, "content");
const CHECK = process.argv.includes("--check");

runSelftest();

// Site-page URLs in zh front matter (`url: "/zh/about/"` — a QUOTED YAML
// scalar) must become their zh-hant counterparts in the generated file, or
// the translation OVERWRITES the Simplified page at build time. Aliases and
// everything else stay put. Query/fragment are preserved; quote style too.
function mapFrontMatterUrl(rawScalar) {
  const dq = rawScalar.match(/^"(.*)"$/);
  const sq = rawScalar.match(/^'(.*)'$/);
  const quote = dq ? '"' : sq ? "'" : "";
  const val = dq ? dq[1] : sq ? sq[1] : rawScalar;
  if (val === "/zh" || val.startsWith("/zh/")) {
    const mapped = "/zh-hant" + val.replace(/^\/zh(?=\/|$)/, "");
    return quote + mapped + quote;
  }
  return rawScalar;
}

// Effective last-modified date of the SOURCE page, in Hugo's real precedence
// with GitInfo enabled: git author date FIRST, then front matter lastmod,
// then front matter date (verified against the built site and by the master's
// post-commit fixture). The translation pins the result as front matter
// lastmod — refreshed on every sync — so the future commit of a .zh-hant.md
// file can never masquerade as a re-verification (the zh-hant language block
// sets frontmatter.lastmod = ["lastmod", "date"]).
function sourceEffectiveLastmod(fm, srcAbs) {
  try {
    const gitDate = execFileSync("git", ["log", "-1", "--format=%aI", "--", srcAbs], {
      cwd: path.dirname(srcAbs), // the source file's own repo context
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"], // fixtures live outside any repo — stay quiet
    }).trim();
    if (gitDate) return gitDate.slice(0, 10);
  } catch {
    // not a git repo / git unavailable (fixtures) — fall through to FM
  }
  const lastmod = fm.match(/^lastmod:\s*(\S+)\s*$/m);
  if (lastmod) return lastmod[1];
  const date = fm.match(/^date:\s*(\S+)\s*$/m);
  return date ? date[1] : null;
}

function walk(dir, filter, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, filter, out);
    else if (e.isFile() && filter(e.name)) out.push(p);
  }
  return out;
}

// Valid content routes (en == zh == zh-hant slugs). `_index.md` maps to its
// directory route; everything else maps to `/dir/name/`.
const routes = new Set(["/"]);
for (const p of walk(CONTENT, (n) => n.endsWith(".md") && !n.includes(".zh"))) {
  const rel = path.relative(CONTENT, p).replaceAll("\\", "/");
  if (rel === "_index.md") continue;
  if (rel.endsWith("_index.md")) routes.add("/" + rel.slice(0, -"_index.md".length));
  else routes.add("/" + rel.replace(/\.md$/, "") + "/");
}

const sources = walk(CONTENT, (n) => n.endsWith(".zh.md"));
let written = 0;
let unchanged = 0;
const failures = [];

for (const src of sources) {
  const target = src.replace(/\.zh\.md$/, ".zh-hant.md");
  const rel = path.relative(ROOT, src);
  // CRLF sources (e.g. thailand/tdac.zh.md) are normalized to LF in the
  // generated file; conversion never rewrites line endings mid-body.
  const raw = readFileSync(src, "utf8").replace(/\r\n/g, "\n");
  const { fm, body } = splitFrontMatter(raw);

  let fmOut = fm;
  if (fm !== null) {
    try {
      fmOut = fm
        .split("\n")
        .map((line) => {
          const mapped = convertFrontMatterLine(line);
          const u = mapped.match(/^(\s*url:\s*)(.*)$/);
          if (u) return u[1] + mapFrontMatterUrl(u[2]);
          return mapped;
        })
        .join("\n");
      // Pin the SOURCE page's effective date: strip any copied lastmod line
      // and re-append the computed one, so pages whose source carries an old
      // FM lastmod under a newer git date still match what Hugo shows for the
      // source (review-09: git author date wins).
      const pinned = sourceEffectiveLastmod(fm, src);
      if (pinned) {
        fmOut = fmOut
          .split("\n")
          .filter((l) => !/^lastmod:/.test(l))
          .join("\n");
        fmOut = fmOut + "\nlastmod: " + pinned;
      }
    } catch (e) {
      failures.push(`${rel}: front matter: ${e.message}`);
      continue;
    }
  }

  const bodyOut = convertMarkdownBody(body);
  const { text: anchored, unresolved } = remapAnchors(body, bodyOut);
  if (unresolved.length) {
    failures.push(`${rel}: anchors not resolvable after conversion: ${unresolved.join(", ")}`);
    continue;
  }
  const { text: bodyRemapped, problems } = remapInternalLinks(anchored, routes);
  if (problems.length) {
    failures.push(`${rel}: in-site links cannot be mapped to /zh-hant/: ${problems.join(", ")}`);
    continue;
  }

  const out = fm === null ? bodyRemapped : `---\n${fmOut}\n---\n${bodyRemapped}`;

  if (CHECK) {
    const existing = existsSync(target) ? readFileSync(target, "utf8") : null;
    if (existing !== out) failures.push(`${path.relative(ROOT, target)}: missing or out of date (re-run sync)`);
    else unchanged++;
    continue;
  }

  if (existsSync(target) && readFileSync(target, "utf8") === out) {
    unchanged++; // idempotent re-run — do not touch mtime
    continue;
  }
  writeFileSync(target, out);
  written++;
}

if (CHECK) {
  if (failures.length) {
    console.error(`sync-zh-hant --check: ${failures.length} problem(s)`);
    for (const f of failures) console.error("  " + f);
    process.exit(1);
  }
  console.log(`sync-zh-hant --check OK: ${unchanged}/${sources.length} translations up to date`);
} else {
  console.log(`sync-zh-hant: ${written} written, ${unchanged} unchanged, ${sources.length} sources, ${failures.length} failures`);
  if (failures.length) {
    for (const f of failures) console.error("  " + f);
    process.exit(1);
  }
}
