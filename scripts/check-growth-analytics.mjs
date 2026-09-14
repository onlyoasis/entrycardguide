import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const html = readFileSync('public/uk/how-to-fill/index.html', 'utf8');
const src = html.match(/src=["']?(\/js\/analytics[^\s>"']+)/)?.[1];
assert.ok(src, 'built analytics bundle exists');
assert.match(html, /data-ga4-hostname=["']?entrycardguide\.com["' >]/, 'rendered script supplies the allowed host');
const code = readFileSync(`public${src}`, 'utf8');
function browser(hostname) {
  const handlers = {};
  class Element { closest(selector) { return selector.includes(`="${this.link?.dataset.analyticsEvent}"`) ? this.link : null; } }
  const window = { location: { hostname, protocol: 'https:' } };
  const document = {
    currentScript: { dataset: { ga4MeasurementId: 'G-TEST', ga4Hostname: 'entrycardguide.com' } },
    addEventListener: (name, callback) => { handlers[name] = callback; },
  };
  runInNewContext(code, { window, document, Element, URL });
  return { window, click(dataset) {
    const target = new Element(); target.link = { dataset, href: 'https://government.example/form?passport=DO-NOT-SEND' };
    handlers.click?.({ target });
  }};
}
for (const host of ['localhost', '127.0.0.1', 'entrycardguide.pages.dev', 'entrycardguide.com.evil.test']) {
  const b = browser(host);
  assert.equal(b.window.dataLayer, undefined, `${host} must not configure production analytics`);
}
const b = browser('entrycardguide.com');
assert.equal(b.window.dataLayer.filter(x => x[0] === 'config').length, 1);
b.click({ analyticsEvent: 'official_link_click', country: 'uk', officialKey: 'eta', linkSlot: 'callout' });
const event = b.window.dataLayer.find(x => x[1] === 'official_link_click');
assert.ok(event, 'official link click is recorded');
assert.deepEqual(JSON.parse(JSON.stringify(event[2])), { destination: 'uk', official_key: 'eta', link_slot: 'callout' });
assert.ok(!JSON.stringify(b.window.dataLayer).includes('DO-NOT-SEND'), 'no input or URL query data');
const count = b.window.dataLayer.length;
b.click({});
assert.equal(b.window.dataLayer.length, count, 'unmarked/archive links are not official clicks');
b.click({ analyticsEvent: 'affiliate_click', affiliatePartner: 'safetywing', affiliateSlot: 'rail' });
assert.equal(b.window.dataLayer.at(-1)[1], 'affiliate_click', 'affiliate tracking is preserved');
console.log('Growth analytics behavior checks passed.');
