#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { validatePublicTravelLibrary } from "./travel-library-public.mjs";

try {
  const args = process.argv.slice(2);
  if (args.length !== 0 && !(args.length === 2 && args[0] === "--root" && args[1])) throw new Error("Usage: node scripts/check-public-travel-library.mjs [--root rootDir]");
  const root = resolve(args[1] || process.cwd());
  const snapshot = JSON.parse(readFileSync(join(root, "data", "travel_library_public.json"), "utf8"));
  const errors = validatePublicTravelLibrary(snapshot);
  if (errors.length) throw new Error(`${errors.length} violation(s)\n${errors.map((error) => `  - ${error}`).join("\n")}`);
  console.log(`check-public-travel-library: OK — ${snapshot.jurisdictions.length} jurisdictions, ${snapshot.records.length} records`);
} catch (error) {
  console.error(`check-public-travel-library: ${error.message}`);
  process.exitCode = 1;
}
