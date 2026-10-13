/**
 * "Is this the official site?" on /official-links/.
 *
 * - ZERO network requests: the official entries are embedded at build time
 *   by layouts/partials/domain-check.html from data/official_urls.
 * - The typed address is never sent or stored. Only a click on the official
 *   link in a match result is counted, like every other official link.
 * - Matching rules live in ./lib/official-host.ts (tested in
 *   tests/official-host.test.mjs).
 */

import { hostFromInput, matchOfficial, type OfficialEntry } from './lib/official-host';

interface Entry extends OfficialEntry {
  k: string; // country key, e.g. "thailand"
  f: string; // entry key inside the country's TOML, e.g. "tdac"
  c: string; // country display name in the page language
  p: string; // country guide path in the page language
  n: string; // entry name
  a: string; // agency
  v: string; // last verified, YYYY-MM-DD
}

interface Payload {
  t: Record<string, string>;
  e: Entry[];
}

function para(text: string, className?: string): HTMLParagraphElement {
  const p = document.createElement('p');
  if (className) p.className = className;
  p.textContent = text;
  return p;
}

function link(text: string, href: string): HTMLAnchorElement {
  const a = document.createElement('a');
  a.href = href;
  a.className = 'text-ink underline underline-offset-2';
  a.textContent = text;
  return a;
}

function render(result: HTMLElement, payload: Payload, input: string) {
  const t = payload.t;
  const outcome = matchOfficial(input, payload.e);
  result.replaceChildren();

  if (outcome.status === 'invalid') {
    result.append(para(t.invalid));
  } else {
    const host = hostFromInput(input) ?? '';
    const checked = para(t.checked, 'text-muted');
    const code = document.createElement('code');
    code.className = 'font-mono text-ink';
    code.textContent = host;
    checked.append(code);

    if (outcome.status === 'no_match') {
      const next = para(t.noMatchBody);
      next.append(link(t.table, '#directory-table'));
      result.append(para(t.noMatch, 'font-medium text-scam'), checked, next);
    } else {
      const entry = outcome.entries[0];
      const links = document.createElement('p');
      const official = link(t.open, entry.url);
      official.target = '_blank';
      official.rel = 'noopener';
      official.dataset.analyticsEvent = 'official_link_click';
      official.dataset.country = entry.k;
      official.dataset.officialKey = entry.f;
      official.dataset.linkSlot = 'checker';
      links.append(link(t.guide, entry.p), document.createTextNode(' · '), official);
      result.append(
        para(t.match, 'font-medium text-verified'),
        checked,
        para(`${entry.c} · ${entry.n}`),
        para(`${t.runBy} ${entry.a}. ${t.verified} ${entry.v}.`, 'text-muted'),
        links,
      );
    }
  }
  result.hidden = false;
}

function wire(root: HTMLElement) {
  const data = root.querySelector<HTMLScriptElement>('script[data-domain-check-data]');
  const form = root.querySelector<HTMLFormElement>('[data-domain-check-form]');
  const input = root.querySelector<HTMLInputElement>('[data-domain-check-input]');
  const result = root.querySelector<HTMLElement>('[data-domain-check-result]');
  if (!data?.textContent || !form || !input || !result) return;

  let payload: Payload;
  try {
    payload = JSON.parse(data.textContent) as Payload;
  } catch (e) {
    console.warn('domain-check: data JSON parse failed', e);
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    render(result, payload, input.value);
  });
  root.hidden = false;
}

function init() {
  document.querySelectorAll<HTMLElement>('[data-domain-check]').forEach(wire);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
