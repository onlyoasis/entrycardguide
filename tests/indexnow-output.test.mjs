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
  for (const language of ["en", "zh"]) {
    mkdirSync(join(output, language), { recursive: true });
    writeFileSync(join(output, language, "sitemap.xml"), `<urlset><url><loc>https://entrycardguide.com/${language}/selected-output/</loc><lastmod>2026-09-12T00:00:00Z</lastmod></url></urlset>`);
  }
  writeFileSync(join(output, `${fakeKey}.txt`), `${fakeKey}\n`);
  return folder;
}

function dryRun(folder, args) {
  return spawnSync(process.execPath, [script, "--dry-run", "--all", ...args], { cwd: folder, encoding: "utf8" });
}

test("IndexNow dry-run reads the selected release directory when public does not exist", () => {
  const folder = fixture("public-release");
  assert.equal(existsSync(join(folder, "public")), false);
  const result = dryRun(folder, ["--public-dir", "public-release"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /2 of 2 URLs/);
  assert.match(result.stdout, /https:\/\/entrycardguide.com\/en\/selected-output\//);
  assert.match(result.stdout, /https:\/\/entrycardguide.com\/zh\/selected-output\//);
  assert.match(result.stdout, /--dry-run, nothing submitted/);
});

test("IndexNow retains the legacy public directory default", () => {
  const result = dryRun(fixture("public"), []);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /2 of 2 URLs/);
  assert.match(result.stdout, /--dry-run, nothing submitted/);
});

test("IndexNow rejects a missing --public-dir value before reading files", () => {
  const result = dryRun(fixture("public"), ["--public-dir"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--public-dir.*requires/);
});
