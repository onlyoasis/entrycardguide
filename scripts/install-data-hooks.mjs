import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const configured = spawnSync('git', ['config', '--get', 'core.hooksPath'], { cwd: root, encoding: 'utf8' });
if (configured.status !== 0 && configured.status !== 1) throw new Error(configured.stderr);
if (configured.status === 0) {
  throw new Error('core.hooksPath is already configured; preserve and integrate the existing hooks manually');
}
const hooks = join(resolve(root, git('rev-parse', '--git-common-dir')), 'hooks');
const checker = join(dirname(fileURLToPath(import.meta.url)), 'check-data-boundary.mjs');
const quote = value => `'${value.replaceAll("'", "'\\''")}'`;
const entries = [
  ['pre-commit', '--index'],
  ['pre-merge-commit', '--index'],
  ['pre-push', '--pre-push'],
].map(([name, mode]) => ({
  path: join(hooks, name),
  content: `#!/bin/sh\n# entrycardguide research data boundary\nexec ${quote(process.execPath)} ${quote(checker)} ${mode}\n`,
}));
for (const entry of entries) {
  if (existsSync(entry.path) && readFileSync(entry.path, 'utf8') !== entry.content) {
    throw new Error(`Existing hook preserved: ${entry.path}`);
  }
}
for (const entry of entries) {
  writeFileSync(entry.path, entry.content, { mode: 0o755 });
  chmodSync(entry.path, 0o755);
  console.log(`Installed ${entry.path}`);
}
