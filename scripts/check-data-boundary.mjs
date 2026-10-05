import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

function git(args, root) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

export function checkIndex(root = process.cwd()) {
  return git(['ls-files', '-z', '--', 'data/travel_library'], root).split('\0').filter(Boolean);
}

export function checkHistory(range = 'HEAD', root = process.cwd()) {
  // Enumerate commit trees without path-based history simplification. A merged
  // branch may contain private data even when its final tree removed the file.
  const commits = git(['rev-list', range], root).trim().split('\n').filter(Boolean);
  const files = new Set();
  for (const commit of commits) {
    for (const name of git(['ls-tree', '-r', '--name-only', '-z', commit, '--', 'data/travel_library'], root).split('\0').filter(Boolean)) files.add(name);
  }
  return [...files];
}

export function checkPush(input, root = process.cwd()) {
  const files = [];
  for (const line of input.trim().split('\n').filter(Boolean)) {
    const fields = line.trim().split(/\s+/);
    if (fields.length !== 4) throw new Error('Invalid pre-push input: expected four fields');
    const [, localOid, , remoteOid] = fields;
    if (/^0+$/.test(localOid)) continue;
    files.push(...checkHistory(/^0+$/.test(remoteOid) ? localOid : `${remoteOid}..${localOid}`, root));
  }
  return [...new Set(files)];
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const mode = process.argv[2] || '--index';
    let files;
    if (mode === '--index') files = checkIndex();
    else if (mode === '--history') files = checkHistory(process.argv[3] || 'HEAD');
    else if (mode === '--pre-push') files = checkPush(readFileSync(0, 'utf8'));
    else throw new Error(`Unknown data boundary mode: ${mode}`);
    if (files.length) {
      console.error(`Research data cannot enter the public repository:\n${files.join('\n')}`);
      process.exitCode = 1;
    } else console.log('check-data-boundary: OK');
  } catch (error) {
    console.error(`check-data-boundary: ${error.message}`);
    process.exitCode = 1;
  }
}
