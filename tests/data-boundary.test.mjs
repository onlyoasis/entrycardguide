import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkIndex, checkHistory, checkPush } from '../scripts/check-data-boundary.mjs';

const scratch = join(process.env.TRAVEL_LIBRARY_TEST_ROOT || '/Volumes/ExternalPrivate/Runtime/entrycardguide/data-protection-20260912', 'git-tests');
mkdirSync(scratch, { recursive: true });
function fixture() {
  const root = mkdtempSync(join(scratch, 'repo-'));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  git('init', '-q');
  git('config', 'user.name', 'Boundary fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'core.hooksPath', '/dev/null');
  writeFileSync(join(root, '.gitignore'), 'data/travel_library/\n');
  git('add', '.gitignore');
  git('commit', '-qm', 'fixture baseline');
  return { root, git };
}

test('真实索引允许公开快照并拒绝强制加入的研究主库', () => {
  const { root, git } = fixture();
  mkdirSync(join(root, 'data/travel_library/records'), { recursive: true });
  writeFileSync(join(root, 'data/travel_library_public.json'), '{}');
  git('add', 'data/travel_library_public.json');
  assert.deepEqual(checkIndex(root), []);
  writeFileSync(join(root, 'data/travel_library/records/AT.json'), '{}');
  git('add', '-f', 'data/travel_library/records/AT.json');
  assert.deepEqual(checkIndex(root), ['data/travel_library/records/AT.json']);
  rmSync(root, { recursive: true });
});

test('推送范围包含中途加入再删除的研究文件时仍拒绝', () => {
  const { root, git } = fixture();
  const before = git('rev-parse', 'HEAD');
  mkdirSync(join(root, 'data/travel_library'), { recursive: true });
  writeFileSync(join(root, 'data/travel_library/jurisdictions.json'), '{}');
  git('add', '-f', 'data/travel_library/jurisdictions.json');
  git('commit', '-qm', 'private fixture');
  git('rm', '-q', 'data/travel_library/jurisdictions.json');
  git('commit', '-qm', 'remove fixture');
  assert.deepEqual(checkIndex(root), []);
  assert.deepEqual(checkHistory(`${before}..HEAD`, root), ['data/travel_library/jurisdictions.json']);
  assert.deepEqual(checkPush(`refs/heads/main ${git('rev-parse', 'HEAD')} refs/heads/main ${before}\n`, root), ['data/travel_library/jurisdictions.json']);
  assert.deepEqual(checkHistory('HEAD^..HEAD', root), []);
  rmSync(root, { recursive: true });
});

test('安装真实hook后git commit拒绝研究主库，已有自定义hook不覆盖', () => {
  const { root, git } = fixture();
  const installer = fileURLToPath(new URL('../scripts/install-data-hooks.mjs', import.meta.url));
  const invoke = () => spawnSync(process.execPath, [installer], { cwd: root, encoding: 'utf8' });
  assert.notEqual(invoke().status, 0, 'existing core.hooksPath must be preserved');
  assert.equal(git('config', '--get', 'core.hooksPath'), '/dev/null');
  git('config', '--unset', 'core.hooksPath');
  assert.equal(invoke().status, 0);
  assert.equal(invoke().status, 0, 'install is idempotent');
  mkdirSync(join(root, 'data/travel_library'), { recursive: true });
  writeFileSync(join(root, 'data/travel_library/private.json'), '{}');
  git('add', '-f', 'data/travel_library/private.json');
  const commit = spawnSync('git', ['commit', '-qm', 'must not commit'], { cwd: root, encoding: 'utf8' });
  assert.notEqual(commit.status, 0);
  assert.match(commit.stderr, /Research data cannot enter/);
  rmSync(root, { recursive: true });
});

test('topic分支先加入再删除研究文件，合并后仍检查全部可达历史', () => {
  const { root, git } = fixture();
  const base = git('rev-parse', 'HEAD');
  const branch = git('branch', '--show-current');
  git('checkout', '-qb', 'topic');
  mkdirSync(join(root, 'data/travel_library'), { recursive: true });
  writeFileSync(join(root, 'data/travel_library/hidden.json'), '{}');
  git('add', '-f', 'data/travel_library/hidden.json');
  git('commit', '-qm', 'private on topic');
  git('rm', '-q', 'data/travel_library/hidden.json');
  git('commit', '-qm', 'remove on topic');
  git('checkout', '-q', branch);
  git('merge', '--no-ff', '-qm', 'merge topic', 'topic');
  assert.deepEqual(checkIndex(root), []);
  assert.deepEqual(checkHistory(`${base}..HEAD`, root), ['data/travel_library/hidden.json']);
  rmSync(root, { recursive: true });
});

test('只在merge解决冲突时加入的研究文件也不能通过历史门禁', () => {
  const { root, git } = fixture();
  writeFileSync(join(root, 'public.txt'), 'base');
  git('add', 'public.txt');
  git('commit', '-qm', 'public base');
  const base = git('rev-parse', 'HEAD');
  const branch = git('branch', '--show-current');
  git('checkout', '-qb', 'topic');
  writeFileSync(join(root, 'public.txt'), 'topic');
  git('commit', '-qam', 'topic change');
  git('checkout', '-q', branch);
  writeFileSync(join(root, 'public.txt'), 'main');
  git('commit', '-qam', 'main change');
  assert.equal(spawnSync('git', ['merge', 'topic'], { cwd: root, encoding: 'utf8' }).status, 1);
  writeFileSync(join(root, 'public.txt'), 'resolved');
  mkdirSync(join(root, 'data/travel_library'), { recursive: true });
  writeFileSync(join(root, 'data/travel_library/resolution.json'), '{}');
  git('add', 'public.txt');
  git('add', '-f', 'data/travel_library/resolution.json');
  git('commit', '-qm', 'resolve with private');
  git('rm', '-q', 'data/travel_library/resolution.json');
  git('commit', '-qm', 'remove private');
  assert.deepEqual(checkIndex(root), []);
  assert.deepEqual(checkHistory(`${base}..HEAD`, root), ['data/travel_library/resolution.json']);
  rmSync(root, { recursive: true });
});
