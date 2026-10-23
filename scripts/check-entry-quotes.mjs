#!/usr/bin/env node
// Re-fetch every data/entry_requirements source and check its quote is still
// on the page. Report only: exits 0 unless --strict and a quote is gone.
//
// usage: node scripts/check-entry-quotes.mjs [country ...]
//          [--out DIR] [--strict] [--timeout-ms 45000] [--concurrency 6]

import { appendFileSync } from "node:fs";
import { mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import TOML from "@iarna/toml";
import {
  BROWSER_ONLY,
  BROWSER_READ_DATE,
  bodyKind,
  decodeBytes,
  htmlToText,
  isFound,
  matchQuote,
  sniffCharset,
} from "./helpers/entry-quotes.mjs";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data", "entry_requirements");
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const execFileAsync = promisify(execFile);

const argv = process.argv.slice(2);
const strict = argv.includes("--strict");
const outDir = getArgValue("--out");
const timeoutMs = Number(getArgValue("--timeout-ms") || "45000");
const concurrency = Number(getArgValue("--concurrency") || "6");
const only = new Set(
  argv.filter((arg, i) => !arg.startsWith("--") && !["--out", "--timeout-ms", "--concurrency"].includes(argv[i - 1])),
);
const today = new Date().toISOString().slice(0, 10);

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const items = await loadItems();
  const tmp = await mkdtemp(path.join(os.tmpdir(), "entry-quotes-"));
  const pages = new Map();
  try {
    const urls = [...new Set(items.map((item) => item.source))].filter((url) => !BROWSER_ONLY.has(url));
    await runPool(urls, concurrency, async (url, i) => {
      pages.set(url, await fetchText(url, path.join(tmp, `${i}.raw`)));
    });
    // Several government sites drop the odd request (520, 503, timeouts);
    // one more pass, one at a time, before reporting them.
    for (const [i, url] of urls.entries()) {
      if (!pages.get(url).ok) pages.set(url, await fetchText(url, path.join(tmp, `${i}.retry.raw`)));
    }
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }

  const rows = items.map((item) => {
    if (BROWSER_ONLY.has(item.source)) return { ...item, result: "manual", status: `browser-${BROWSER_READ_DATE}` };
    const page = pages.get(item.source);
    if (!page.ok) return { ...item, result: "fetch-failed", status: page.error };
    const { status, ratio } = matchQuote(item.quote, page.text);
    return { ...item, result: isFound(status) ? "found" : "missing", status, ratio };
  });

  const counts = tally(rows);
  printConsole(rows, counts);
  const markdown = renderMarkdown(rows, counts);
  if (outDir) {
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "entry-quotes.md"), markdown, "utf8");
    await writeFile(
      path.join(outDir, "entry-quotes.json"),
      `${JSON.stringify({ date: today, counts, items: rows }, null, 1)}\n`,
      "utf8",
    );
    console.log(`\nReport written to ${path.join(outDir, "entry-quotes.md")}`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);

  if (strict && counts.missing > 0) {
    console.error(`${counts.missing} quote(s) no longer found in --strict mode.`);
    process.exitCode = 1;
  }
}

function getArgValue(name) {
  const index = argv.indexOf(name);
  return index === -1 ? "" : argv[index + 1] || "";
}

async function loadItems() {
  const files = (await readdir(DATA_DIR)).filter((name) => name.endsWith(".toml")).sort();
  const items = [];
  for (const file of files) {
    const country = file.replace(/\.toml$/, "");
    if (only.size > 0 && !only.has(country)) continue;
    const data = TOML.parse(await readFile(path.join(DATA_DIR, file), "utf8"));
    (data.items || []).forEach((item, index) => {
      items.push({ country, index: index + 1, topic: item.topic, source: item.source, quote: item.quote });
    });
  }
  if (only.size > 0 && items.length === 0) throw new Error(`No items for: ${[...only].join(", ")}`);
  return items;
}

async function runPool(list, size, worker) {
  let next = 0;
  const lanes = Array.from({ length: Math.min(size, list.length) }, async () => {
    while (next < list.length) {
      const i = next++;
      await worker(list[i], i);
    }
  });
  await Promise.all(lanes);
}

// curl rather than fetch(): it matches what the research check saw, and some
// government servers send certificate chains or headers that undici rejects.
async function fetchText(url, rawPath) {
  let stdout;
  try {
    ({ stdout } = await execFileAsync(
      "curl",
      [
        "-sL", "--compressed", "-m", String(Math.ceil(timeoutMs / 1000)),
        "-A", UA, "-H", "Accept-Language: en,zh;q=0.8",
        "-o", rawPath, "-w", "%{http_code} %{content_type}", url,
      ],
      { timeout: timeoutMs + 5000 },
    ));
  } catch (error) {
    const code = error.code === 28 ? "timeout" : `curl exit ${error.code ?? error.signal}`;
    return { ok: false, error: `fetch-${code}` };
  }
  const [httpCode, contentType = ""] = [stdout.slice(0, 3), stdout.slice(4)];
  if (!httpCode.startsWith("2")) return { ok: false, error: `fetch-${httpCode}` };
  if (!(await stat(rawPath).catch(() => null))?.size) return { ok: false, error: "fetch-empty" };

  const bytes = await readFile(rawPath);
  const kind = bodyKind(url, contentType, bytes.subarray(0, 5).toString("latin1"));
  let text;
  if (kind === "pdf") {
    try {
      ({ stdout: text } = await execFileAsync("pdftotext", ["-layout", rawPath, "-"], { maxBuffer: 64 << 20 }));
    } catch (error) {
      return { ok: false, error: error.code === "ENOENT" ? "pdftotext-missing" : "pdftotext-failed" };
    }
  } else {
    const decoded = decodeBytes(bytes, sniffCharset(bytes, contentType));
    text = kind === "raw" ? decoded : htmlToText(decoded);
  }
  if (text.trim().length <= 200) return { ok: false, error: "fetch-too-short" };
  return { ok: true, text };
}

function tally(rows) {
  const counts = { total: rows.length, found: 0, missing: 0, "fetch-failed": 0, manual: 0 };
  for (const row of rows) counts[row.result]++;
  return counts;
}

function printConsole(rows, counts) {
  for (const row of rows) {
    if (row.result === "found") continue;
    const ratio = row.result === "missing" ? ` ${row.ratio}` : "";
    console.log(`${row.result.padEnd(12)} ${row.country}#${row.index} ${row.topic} [${row.status}${ratio}] ${row.source}`);
  }
  console.log(
    `\nitems=${counts.total} found=${counts.found} missing=${counts.missing} fetch-failed=${counts["fetch-failed"]} manual=${counts.manual}`,
  );
}

function renderMarkdown(rows, counts) {
  const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\s+/g, " ");
  const section = (title, result, extra) => {
    const list = rows.filter((row) => row.result === result);
    if (list.length === 0) return [];
    return [
      `### ${title} (${list.length})`,
      "",
      "| Item | Topic | Status | Source | Quote |",
      "| --- | --- | --- | --- | --- |",
      ...list.map(
        (row) =>
          `| ${row.country}#${row.index} | ${row.topic} | ${cell(row.status)}${extra(row)} | ${cell(row.source)} | ${cell(row.quote.slice(0, 160))} |`,
      ),
      "",
    ];
  };
  return [
    "## Entry requirement quotes",
    "",
    `Checked: \`${today}\``,
    "",
    `Items: **${counts.total}** · found: **${counts.found}** · quote missing: **${counts.missing}** · fetch failed: **${counts["fetch-failed"]}** · manual review: **${counts.manual}**`,
    "",
    ...section("Quote missing", "missing", (row) => ` ${row.ratio}`),
    ...section("Fetch failed", "fetch-failed", () => ""),
    ...section(`Manual review (browser-only, last read ${BROWSER_READ_DATE})`, "manual", () => ""),
  ].join("\n");
}
