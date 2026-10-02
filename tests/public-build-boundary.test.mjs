import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const source = fileURLToPath(new URL('../', import.meta.url));
const scratch = join(process.env.TRAVEL_LIBRARY_TEST_ROOT || '/Volumes/ExternalPrivate/Runtime/entrycardguide/data-protection-20260912', 'build-tests');
mkdirSync(scratch, { recursive: true });

test('production renders all public destinations in three languages, ignores broken research and removes withdrawn pages', { timeout: 180000 }, () => {
  const root = mkdtempSync(join(scratch, 'site-'));
  for (const name of ['assets', 'content', 'data', 'layouts', 'i18n', 'static', 'config', 'scripts', 'package.json', 'config.toml', 'functions', 'tailwind.config.js', 'postcss.config.js']) {
    cpSync(join(source, name), join(root, name), { recursive: true, filter: file => resolve(file) !== resolve(source, 'data/travel_library') });
  }
  symlinkSync(join(source, 'node_modules'), join(root, 'node_modules'), 'dir');
  execFileSync('git', ['init', '-q'], { cwd: root });
  const config = join(root, 'config.toml');
  writeFileSync(config, readFileSync(config, 'utf8').replace('enableGitInfo = true', 'enableGitInfo = false'));
  const env = { ...process.env, HUGO_CACHEDIR: join(root, '.cache/hugo'), HUGO_RESOURCEDIR: join(root, 'resources') };
  let sequence=0;
  function run(command,args,expected=0) {
    const result=spawnSync(command,args,{cwd:root,env,encoding:'utf8',timeout:60000});
    writeFileSync(join(root,`check-${++sequence}.log`),`${result.stdout||''}${result.stderr||''}`);
    if(expected===0)assert.equal(result.status,0,result.stderr||result.stdout||result.error?.message);
    else assert.notEqual(result.status,0,'invalid input must not succeed');
    return result;
  }
  const build=expected=>run(process.execPath,['scripts/build-public.mjs'],expected);
  const snapshotPath=join(root,'data/travel_library_public.json');
  const snapshot=JSON.parse(readFileSync(snapshotPath,'utf8'));
  const privateRoot=join(root,'data/travel_library');
  mkdirSync(join(privateRoot,'records'),{recursive:true});
  writeFileSync(join(privateRoot,'jurisdictions.json'),'{BROKEN_PRIVATE_JSON');
  writeFileSync(join(privateRoot,'records/ZZ.json'),'PRIVATE_RESEARCH_CANARY');
  mkdirSync(join(root,'public-release/library/stale'),{recursive:true});
  writeFileSync(join(root,'public-release/library/stale/index.html'),'PRIVATE_OLD_BUILD_CANARY');
  build(0);
  assert.equal(existsSync(join(root,'public-release/library/stale/index.html')),false);
  for(const prefix of ['', 'zh/', 'zh-hant/']) {
    const directory=readFileSync(join(root,`public-release/${prefix}library/index.html`),'utf8');
    assert.equal((directory.match(/data-library-row/g)||[]).length,249,prefix);
    assert.doesNotMatch(directory, /%!\w\(/, 'directory numeric formatting');
    for(const destination of snapshot.jurisdictions)assert.equal(existsSync(join(root,`public-release/${prefix}library/${destination.id.toLowerCase()}/index.html`)),true,prefix+destination.id);
    const blocked=readFileSync(join(root,`public-release/${prefix}library/af/index.html`),'utf8');
    assert.doesNotMatch(blocked,/class=.?library-procedure\b/);
    assert.doesNotMatch(blocked, /%!\w\(/, 'detail numeric formatting');
    assert.doesNotMatch(directory,/PRIVATE_RESEARCH_CANARY|PRIVATE_OLD_BUILD_CANARY/);
  }
  run(process.execPath,['scripts/check-seo-output.mjs','public-release']);
  rmSync(snapshotPath);
  assert.match(build(1).stderr,/travel_library_public|ENOENT/);
  writeFileSync(snapshotPath,JSON.stringify({...snapshot,evidence_excerpt:'private'}));
  assert.match(build(1).stderr,/unknown public field/);
  const jp=snapshot.jurisdictions.find(j=>j.id==='JP');
  const record=snapshot.records.find(r=>r.jurisdiction_id==='JP');
  writeFileSync(snapshotPath,JSON.stringify({schema_version:2,jurisdictions:[jp],records:[record]}));
  build(0);
  for(const prefix of ['', 'zh/', 'zh-hant/']) {
    const page=readFileSync(join(root,`public-release/${prefix}library/jp/index.html`),'utf8');
    assert.match(page,/#source-/);
    assert.match(page,/customs\.go\.jp/);
    assert.doesNotMatch(page,/PRIVATE_RESEARCH_CANARY|PRIVATE_OLD_BUILD_CANARY/);
    assert.equal(existsSync(join(root,`public-release/${prefix}library/us`)),false);
  }
  writeFileSync(snapshotPath,JSON.stringify({schema_version:2,jurisdictions:[],records:[]}));
  build(0);
  assert.equal(existsSync(join(root,'public-release/library/jp')),false);
  run(process.execPath,['scripts/check-public-output.mjs']);
});
