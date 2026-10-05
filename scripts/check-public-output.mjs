import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { validatePublicTravelLibrary } from './travel-library-public.mjs';

export function checkPublicOutput(directory, snapshot) {
  const errors = validatePublicTravelLibrary(snapshot);
  if (errors.length) return errors;
  if (!existsSync(directory)) return [`Missing public output: ${directory}`];
  const published = new Set(snapshot.records.map(record => record.jurisdiction_id.toLowerCase()));
  function checkLibraryPath(path, file) {
    const match = path.match(/^(?:zh\/)?library\/([^/]+)(?:\/|$)/);
    if (match && !['index.html', 'index.xml'].includes(match[1]) && !published.has(match[1])) {
      errors.push(`${file}: library destination ${match[1]} is not in the public snapshot`);
    }
  }
  function walk(folder) {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const full = join(folder, entry.name);
      const file = relative(directory, full).split('\\').join('/');
      if (/(?:^|\/)travel_library(?:\/|\.json$)/.test(file)) errors.push(`${file}: Private data path`);
      if (entry.isSymbolicLink()) errors.push(`${file}: Symbolic links are not public build artifacts`);
      else if (entry.isDirectory()) walk(full);
      else if (/\.(?:html|json|txt|xml|js|map)$/i.test(file)) {
        checkLibraryPath(file, file);
        const body = readFileSync(full, 'utf8');
        if (/data-library-mode\s*=\s*["']?research\b/.test(body)) errors.push(`${file}: Research page in public output`);
        if (/["'](?:evidence_excerpt|unresolved|access_status|supports)["']\s*:/.test(body)) errors.push(`${file}: Private field in public output`);
        for (const match of body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)) {
          try { checkLibraryPath(new URL(match[1].trim()).pathname.slice(1), file); }
          catch { errors.push(`${file}: Invalid sitemap URL ${match[1]}`); }
        }
      }
    }
  }
  walk(directory);
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const snapshot = JSON.parse(readFileSync('data/travel_library_public.json', 'utf8'));
    const errors = checkPublicOutput(resolve(process.argv[2] || 'public-release'), snapshot);
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('check-public-output: OK');
  } catch (error) {
    console.error(`check-public-output: ${error.message}`);
    process.exitCode = 1;
  }
}
