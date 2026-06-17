#!/usr/bin/env node

import { appendFileSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data", "official_urls");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const args = new Set(process.argv.slice(2));
const write = args.has("--write");
const strict = args.has("--strict");
const dateArg = getArgValue("--date");
const targetDate = dateArg || new Date().toISOString().slice(0, 10);
const timeoutMs = Number(getArgValue("--timeout-ms") || "20000");
const execFileAsync = promisify(execFile);

if (!DATE_RE.test(targetDate)) {
  throw new Error(`--date must be YYYY-MM-DD, got ${targetDate}`);
}

const headers = {
  "user-agent":
    "Mozilla/5.0 (compatible; entrycardguide-url-verifier/1.0; +https://entrycardguide.com/about/)",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.8",
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const files = (await readdir(DATA_DIR))
    .filter((name) => name.endsWith(".toml"))
    .sort();

  const results = [];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const text = await readFile(filePath, "utf8");
    const parsed = parseOfficialToml(text, file);

    for (const entry of parsed.entries) {
      const result = await verify(entry);
      results.push(result);
    }

    if (write) {
      const successes = new Set(
        results
          .filter((result) => result.file === file && result.ok)
          .map((result) => result.section),
      );
      const fileResults = results.filter((result) => result.file === file);
      const allPassed =
        fileResults.length > 0 && fileResults.every((result) => result.ok);
      const nextText = updateTomlText(text, successes, allPassed);
      if (nextText !== text) {
        await writeFile(filePath, nextText, "utf8");
      }
    }
  }

  printSummary(results);
  writeGithubSummary(results);

  const okCount = results.filter((result) => result.ok).length;
  const failed = results.filter((result) => !result.ok);

  if (okCount === 0) {
    console.error("No official URLs could be verified. Refusing to update dates.");
    process.exitCode = 1;
    return;
  }

  if (strict && failed.length > 0) {
    console.error(`${failed.length} URL(s) failed verification in --strict mode.`);
    process.exitCode = 1;
  }
}

function getArgValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return "";
  return process.argv[index + 1] || "";
}

function parseOfficialToml(text, file) {
  const lines = text.split("\n");
  let current = null;
  const sections = new Map();

  for (const line of lines) {
    const sectionMatch = line.match(/^\s*\[([A-Za-z0-9_-]+)\]\s*$/);
    if (sectionMatch) {
      current = sectionMatch[1];
      if (!sections.has(current)) {
        sections.set(current, { file, section: current });
      }
      continue;
    }

    if (!current || !sections.has(current)) continue;
    const section = sections.get(current);

    const url = readStringField(line, "url");
    if (url) section.url = url;

    const lastVerified = readStringField(line, "last_verified");
    if (lastVerified) section.lastVerified = lastVerified;

    const formKey = readStringField(line, "form_key");
    if (formKey) section.formKey = formKey;
  }

  const meta = sections.get("meta") || {};
  const primaryKey = meta.formKey || "";
  const entries = [...sections.values()]
    .filter((section) => section.url && section.lastVerified)
    .map((section) => ({
      ...section,
      primary: section.section === primaryKey,
    }));

  return { entries };
}

function readStringField(line, field) {
  const match = line.match(
    new RegExp(`^\\s*${field}\\s*=\\s*"([^"]*)"\\s*(?:#.*)?$`),
  );
  return match ? match[1] : "";
}

async function verify(entry) {
  const fetchResult = await verifyWithFetch(entry);
  if (fetchResult.ok) return fetchResult;

  const curlResult = await verifyWithCurl(entry);
  if (curlResult.ok) return curlResult;

  return {
    ...curlResult,
    error: [fetchResult.error || `HTTP ${fetchResult.status}`, curlResult.error]
      .filter(Boolean)
      .join("; curl: "),
  };
}

async function verifyWithFetch(entry) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(entry.url, {
      method: "GET",
      redirect: "follow",
      headers,
      signal: controller.signal,
    });

    return {
      ...entry,
      ok: response.status >= 200 && response.status < 400,
      status: response.status,
      finalUrl: response.url,
    };
  } catch (error) {
    return {
      ...entry,
      ok: false,
      error: cleanError(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function verifyWithCurl(entry) {
  try {
    const { stdout } = await execFileAsync(
      "curl",
      [
        "-sS",
        "-L",
        "--max-time",
        String(Math.ceil(timeoutMs / 1000)),
        "-A",
        headers["user-agent"],
        "-o",
        "/dev/null",
        "-w",
        "%{http_code} %{url_effective}",
        entry.url,
      ],
      { timeout: timeoutMs + 5000 },
    );
    const [statusText, finalUrl = entry.url] = stdout.trim().split(/\s+/, 2);
    const status = Number(statusText);
    return {
      ...entry,
      ok: status >= 200 && status < 400,
      status,
      finalUrl,
      error: status ? `HTTP ${status}` : "curl returned no HTTP status",
    };
  } catch (error) {
    return {
      ...entry,
      ok: false,
      error: cleanError(error),
    };
  }
}

function cleanError(error) {
  if (error.name === "AbortError") return "timeout";
  if (error.cause?.code) return error.cause.code;
  if (error.stderr) {
    const stderr = String(error.stderr).trim().split("\n").at(-1);
    if (stderr) return stderr;
  }
  if (error.code) return error.code;
  return error.message || String(error);
}

function updateTomlText(text, successes, updateHeader) {
  const lines = text.split("\n");
  let current = null;

  return lines
    .map((line) => {
      const sectionMatch = line.match(/^\s*\[([A-Za-z0-9_-]+)\]\s*$/);
      if (sectionMatch) {
        current = sectionMatch[1];
        return line;
      }

      if (updateHeader && /^# Last verified: \d{4}-\d{2}-\d{2}/.test(line)) {
        return `# Last verified: ${targetDate}`;
      }

      if (
        current &&
        successes.has(current) &&
        /^\s*last_verified\s*=/.test(line)
      ) {
        return line.replace(
          /(^\s*last_verified\s*=\s*")\d{4}-\d{2}-\d{2}(".*$)/,
          `$1${targetDate}$2`,
        );
      }

      return line;
    })
    .join("\n");
}

function printSummary(results) {
  const rows = results.map((result) => ({
    file: result.file,
    section: result.section,
    status: result.ok ? `ok ${result.status}` : "failed",
    verified: result.ok ? targetDate : result.lastVerified,
    url: result.url,
    note: result.ok ? "" : result.error || `HTTP ${result.status}`,
  }));

  console.table(rows);

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    console.warn("\nSome URLs were not updated:");
    for (const result of failed) {
      console.warn(
        `- ${result.file} [${result.section}] ${result.url}: ${result.error || `HTTP ${result.status}`}`,
      );
    }
  }
}

function writeGithubSummary(results) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;

  const passed = results.filter((result) => result.ok);
  const failed = results.filter((result) => !result.ok);
  const lines = [
    "## Official URL verification",
    "",
    `Target date: \`${targetDate}\``,
    "",
    `Verified: **${passed.length}**`,
    `Not updated: **${failed.length}**`,
    "",
    "| Result | File | Section | Status | URL |",
    "|---|---|---|---|---|",
    ...results.map((result) => {
      const mark = result.ok ? "PASS" : "SKIP";
      const status = result.ok
        ? String(result.status)
        : result.error || `HTTP ${result.status}`;
      return `| ${mark} | \`${result.file}\` | \`${result.section}\` | ${status} | ${result.url} |`;
    }),
    "",
  ];

  appendFileSync(summaryPath, `${lines.join("\n")}\n`);
}
