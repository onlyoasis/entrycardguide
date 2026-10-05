#!/usr/bin/env node
import { readFileSync, writeFileSync, renameSync, unlinkSync, existsSync } from "node:fs";
import { join, dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { projectPublicTravelLibrary } from "./travel-library-public.mjs";

try {
  const options = {};
  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index += 2) {
    const option = args[index];
    if (!["--ids", "--root", "--output"].includes(option) || Object.hasOwn(options, option)) throw new Error(`Unknown or duplicate option: ${option}`);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${option}: requires a non-empty value`);
    options[option] = value;
  }
  if (!options["--ids"]) throw new Error("--ids: explicitly select jurisdiction IDs, for example --ids JP,SG");
  const ids = options["--ids"].split(",").map((id) => id.trim());
  if (ids.some((id) => !/^[A-Z]{2}$/.test(id)) || new Set(ids).size !== ids.length) throw new Error("--ids: expected unique uppercase two-letter IDs");
  const root = resolve(options["--root"] || process.cwd());
  const output = resolve(options["--output"] || join(root, "data", "travel_library_public.json"));
  const researchDir = join(root, "data", "travel_library");
  if (output === researchDir || output.startsWith(`${researchDir}${sep}`)) throw new Error("--output: cannot overwrite research files");
  const validator = join(dirname(fileURLToPath(import.meta.url)), "check-travel-library.mjs");
  const check = spawnSync(process.execPath, [validator, root], { encoding: "utf8" });
  if (check.error) throw check.error;
  if (check.status !== 0) throw new Error(`Research validation failed:\n${check.stderr || check.stdout}`);
  const jurisdictions = JSON.parse(readFileSync(join(researchDir, "jurisdictions.json"), "utf8")).jurisdictions;
  const records = ids.map((id) => {
    const jurisdiction = jurisdictions.find((entry) => entry.id === id);
    if (!jurisdiction?.records_file) throw new Error(`ids.${id}: jurisdiction or research record does not exist`);
    return JSON.parse(readFileSync(join(researchDir, jurisdiction.records_file), "utf8"));
  });
  const snapshot = projectPublicTravelLibrary(jurisdictions, records, ids);
  const temporary = `${output}.tmp-${process.pid}`;
  try {
    writeFileSync(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, { flag: "wx" });
    renameSync(temporary, output);
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary);
  }
  console.log(`export-public-travel-library: OK — ${ids.length} selected jurisdictions → ${output}`);
} catch (error) {
  console.error(`export-public-travel-library: ${error.message}`);
  process.exitCode = 1;
}
