import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

if (process.argv.length > 2) throw new Error('Public builds use a fixed environment and public-release directory; extra arguments are not accepted');
const root = process.cwd();
const output = join(root, 'public-release');
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed with ${result.status ?? result.signal}`);
}
try {
  run(process.execPath, ['scripts/check-data-boundary.mjs', '--index']);
  run(process.execPath, ['scripts/check-public-travel-library.mjs']);
  // This directory belongs exclusively to this reproducible public build.
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output, { recursive: true });
  run('hugo', ['--gc', '--minify', '--environment', 'production', '--destination', output,
    '--cacheDir', process.env.HUGO_CACHEDIR || join(root, '.cache/hugo')]);
  run(process.execPath, ['scripts/check-public-output.mjs', output]);
} catch (error) {
  console.error(`build-public: ${error.message}`);
  process.exitCode = 1;
}
