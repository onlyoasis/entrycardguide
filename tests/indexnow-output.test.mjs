import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = join(dirname(fileURLToPath(import.meta.url)), "..", "scripts", "submit-indexnow.mjs");
const scratch = process.env.TRAVEL_LIBRARY_TEST_ROOT || "/Volumes/ExternalPrivate/Runtime/entrycardguide/data-protection-20260912/worker-snapshot";
if (!process.env.TRAVEL_LIBRARY_TEST_ROOT) {
  assert.equal(existsSync("/Volumes/ExternalPrivate/Runtime/entrycardguide/data-protection-20260912"), true, "External test volume must be available");
}
mkdirSync(scratch, { recursive: true });

function fixture(outputName) {
  const folder = mkdtempSync(join(scratch, "indexnow-"));
  const output = join(folder, outputName);
  const fakeKey = "00000000000000000000000000000001";
  for (const language of ["en", "zh", "zh-hant"]) {
    mkdirSync(join(output, language), { recursive: true });
    writeFileSync(join(output, language, "sitemap.xml"), `<urlset><url><loc>https://entrycardguide.com/${language}/selected-output/</loc><lastmod>2026-09-12T00:00:00Z</lastmod></url></urlset>`);
  }
  writeFileSync(join(output, `${fakeKey}.txt`), `${fakeKey}\n`);
  return folder;
}

function dryRun(folder, args) {
  return spawnSync(process.execPath, [script, "--dry-run", "--all", ...args], { cwd: folder, encoding: "utf8" });
}

test("IndexNow dry-run reads all three public-release sitemaps", () => {
  const folder = fixture("public-release");
  assert.equal(existsSync(join(folder, "public")), false);
  const result = dryRun(folder, []);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /3 of 3 URLs/);
  assert.match(result.stdout, /https:\/\/entrycardguide.com\/en\/selected-output\//);
  assert.match(result.stdout, /https:\/\/entrycardguide.com\/zh\/selected-output\//);
  assert.match(result.stdout, /--dry-run, nothing submitted/);
});

test("IndexNow never falls back to legacy public or research-public outputs", () => {
  for (const output of ["public", "research-public"]) {
    const result = dryRun(fixture(output), []);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /public-release/);
  }
});
