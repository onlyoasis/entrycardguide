import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { checkPublicOutput } from '../scripts/check-public-output.mjs';

const scratch = join(process.env.TRAVEL_LIBRARY_TEST_ROOT || '/Volumes/ExternalPrivate/Runtime/entrycardguide/data-protection-20260912', 'output-tests');
mkdirSync(scratch, { recursive: true });
const snapshot = { schema_version: 1, jurisdictions: [], records: [] };
function fixture() {
  const root = mkdtempSync(join(scratch, 'site-'));
  writeFileSync(join(root, 'index.html'), '<h1>Official links</h1>');
  return root;
}
test('公开空快照允许正常页面，但拒绝旧研究详情页', () => {
  const root = fixture();
  assert.deepEqual(checkPublicOutput(root, snapshot), []);
  mkdirSync(join(root, 'library/at'), { recursive: true });
  writeFileSync(join(root, 'library/at/index.html'), '<h1>Old research</h1>');
  assert.match(checkPublicOutput(root, snapshot).join('\n'), /not in the public snapshot/);
  rmSync(root, { recursive: true });
});
test('研究标记和内部JSON字段不能进入产物', () => {
  const root = fixture();
  writeFileSync(join(root, 'index.html'), '<header data-library-mode=research>Private</header>');
  assert.match(checkPublicOutput(root, snapshot).join('\n'), /Research page/);
  writeFileSync(join(root, 'index.html'), '<h1>Public</h1>');
  writeFileSync(join(root, 'download.json'), '{"evidence_excerpt":"private note"}');
  assert.match(checkPublicOutput(root, snapshot).join('\n'), /Private field/);
  rmSync(root, { recursive: true });
});
test('sitemap和下载路径中的研究残留也被拒绝', () => {
  const root = fixture();
  writeFileSync(join(root, 'sitemap.xml'), '<urlset><url><loc>https://entrycardguide.com/zh/library/at/</loc></url></urlset>');
  assert.match(checkPublicOutput(root, snapshot).join('\n'), /not in the public snapshot/);
  mkdirSync(join(root, 'data/travel_library'), { recursive: true });
  writeFileSync(join(root, 'data/travel_library/AT.json'), '{}');
  assert.match(checkPublicOutput(root, snapshot).join('\n'), /Private data path/);
  rmSync(root, { recursive: true });
});
