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

test('资料库只检查可见研究文字，不误报正常脚本与SRI；格式错误会阻断', () => {
  const root = fixture();
  mkdirSync(join(root, 'zh-hant/library'), { recursive: true });
  const page = join(root, 'zh-hant/library/index.html');
  writeFileSync(page, '<script src="/js/validator.js" integrity="sha256-public"></script><h1>公開資料庫</h1>');
  assert.deepEqual(checkPublicOutput(root, snapshot), []);
  writeFileSync(page, '<p>source-cache/private-form.txt</p>');
  assert.match(checkPublicOutput(root, snapshot).join('\n'), /Private research text/);
  writeFileSync(page, '<p>%!d(float64=1) 個事項</p>');
  assert.match(checkPublicOutput(root, snapshot).join('\n'), /Template formatting error/);
  rmSync(root, { recursive: true });
});

test('繁体目的地与sitemap使用相同公开范围门禁', () => {
  const root = fixture();
  mkdirSync(join(root, 'zh-hant/library/at'), { recursive: true });
  writeFileSync(join(root, 'zh-hant/library/at/index.html'), '<h1>舊資料</h1>');
  writeFileSync(join(root, 'sitemap.xml'), '<urlset><url><loc>https://entrycardguide.com/zh-hant/library/at/</loc></url></urlset>');
  const errors = checkPublicOutput(root, snapshot);
  assert.equal(errors.filter(error => /not in the public snapshot/.test(error)).length, 2);
  rmSync(root, { recursive: true });
});
