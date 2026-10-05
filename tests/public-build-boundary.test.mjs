import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const source = fileURLToPath(new URL('../', import.meta.url));
const scratch = join(process.env.TRAVEL_LIBRARY_TEST_ROOT || '/Volumes/ExternalPrivate/Runtime/entrycardguide/data-protection-20260912', 'build-tests');
mkdirSync(scratch, { recursive: true });

test('真实生产入口隔离研究主库、清除旧研究产物，并保留公开来源', { timeout: 180000 }, () => {
  const root = mkdtempSync(join(scratch, 'site-'));
  for (const name of ['assets', 'content', 'data', 'layouts', 'i18n', 'static', 'config', 'scripts', 'package.json', 'config.toml', 'tailwind.config.js', 'postcss.config.js']) {
    cpSync(join(source, name), join(root, name), {
      recursive: true,
      filter: file => resolve(file) !== resolve(source, 'data/travel_library'),
    });
  }
  symlinkSync(join(source, 'node_modules'), join(root, 'node_modules'), 'dir');
  execFileSync('git', ['init', '-q'], { cwd: root });
  const config = join(root, 'config.toml');
  writeFileSync(config, readFileSync(config, 'utf8').replace('enableGitInfo = true', 'enableGitInfo = false'));
  const env = { ...process.env, HUGO_CACHEDIR: join(root, '.cache/hugo'), HUGO_RESOURCEDIR: join(root, 'resources') };
  let sequence = 0;
  function run(command, args, expected = 0) {
    const result = spawnSync(command, args, { cwd: root, env, encoding: 'utf8', timeout: 45000 });
    writeFileSync(join(root, `check-${++sequence}.log`), `${result.stdout || ''}${result.stderr || ''}`);
    if (expected === 0) assert.equal(result.status, 0, result.stderr || result.stdout || result.error?.message);
    else assert.notEqual(result.status, 0, 'invalid input must not succeed');
    return result;
  }
  const build = expected => run(process.execPath, ['scripts/build-public.mjs'], expected);
  const snapshotPath = join(root, 'data/travel_library_public.json');
  const empty = { schema_version: 1, jurisdictions: [], records: [] };
  writeFileSync(snapshotPath, JSON.stringify(empty));
  mkdirSync(join(root, 'public-release/library/stale'), { recursive: true });
  writeFileSync(join(root, 'public-release/library/stale/index.html'), 'PRIVATE_OLD_BUILD_CANARY');
  build(0);
  assert.equal(existsSync(join(root, 'public-release/library/stale/index.html')), false);
  assert.equal(existsSync(join(root, 'data/travel_library')), false, 'no hidden dependency on private research');
  run(process.execPath, ['scripts/check-seo-output.mjs', 'public-release']);

  const privateRoot = join(root, 'data/travel_library');
  mkdirSync(join(privateRoot, 'records'), { recursive: true });
  writeFileSync(join(privateRoot, 'jurisdictions.json'), '{BROKEN_PRIVATE_JSON');
  build(0);
  run('hugo', ['--environment', 'research'], 1);
  rmSync(snapshotPath);
  assert.match(build(1).stderr, /travel_library_public|ENOENT/);
  writeFileSync(snapshotPath, JSON.stringify({ ...empty, evidence_excerpt: 'private' }));
  assert.match(build(1).stderr, /unknown public field/);

  const jurisdiction = { id: 'ZZ', name_en: 'Fixture destination', name_zh: '测试目的地', region: 'Asia', existing_site_key: null };
  const record = {
    jurisdiction_id: 'ZZ', review_status: 'verified', researched_at: '2026-01-01',
    procedures: [{ id: 'ZZ-arrival', type: 'arrival_card', name_en: 'Fixture arrival', name_zh: '测试入境卡', agency: 'Fixture agency',
      official_url: 'https://official.example.invalid/arrival', channel: 'online', fee: 'unknown',
      applicability_en: 'Fixture travelers', applicability_zh: '测试旅客', timing_en: 'Before arrival', timing_zh: '抵达前',
      source_ids: ['official-source'], verified_at: '2026-01-01' }],
    sources: [{ id: 'official-source', title: 'Official fixture source', publisher: 'Fixture agency', url: 'https://official.example.invalid/source' }],
  };
  const snapshot = { schema_version: 1, jurisdictions: [jurisdiction], records: [record] };
  writeFileSync(snapshotPath, JSON.stringify(snapshot));
  writeFileSync(join(privateRoot, 'jurisdictions.json'), JSON.stringify({ jurisdictions: [{ ...jurisdiction, records_file: 'records/ZZ.json' }] }));
  const privateRecord = structuredClone(record);
  privateRecord.sources[0].evidence_excerpt = 'PRIVATE_RESEARCH_EXCERPT_CANARY';
  writeFileSync(join(privateRoot, 'records/ZZ.json'), JSON.stringify(privateRecord));
  run('hugo', ['--environment', 'research', '--destination', 'public-release']);
  assert.match(readFileSync(join(root, 'public-release/library/zz/index.html'), 'utf8'), /PRIVATE_RESEARCH_EXCERPT_CANARY/);
  build(0);
  const page = readFileSync(join(root, 'public-release/library/zz/index.html'), 'utf8');
  assert.match(page, /https:\/\/official\.example\.invalid\/source/);
  assert.match(page, /#source-official-source/);
  function assertNoPrivate(folder) {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name);
      if (entry.isDirectory()) assertNoPrivate(path);
      else assert.doesNotMatch(readFileSync(path).toString(), /PRIVATE_RESEARCH_EXCERPT_CANARY|PRIVATE_OLD_BUILD_CANARY/, path);
    }
  }
  assertNoPrivate(join(root, 'public-release'));
  run(process.execPath, ['scripts/check-seo-output.mjs', 'public-release']);
  writeFileSync(snapshotPath, JSON.stringify(empty));
  build(0);
  assert.equal(existsSync(join(root, 'public-release/library/zz')), false, 'withdrawn public destination has no stale page');
  run(process.execPath, ['scripts/check-public-output.mjs']);
});
