/**
 * Ask tool — site-grounded Q&A engine for the /ask/ page.
 *
 * v1.0 design constraints (same as validator.ts / decide.ts / search.ts):
 * - ZERO npm dependencies. Bundled via Hugo's js.Build pipe.
 * - No innerHTML / no DOM injection. Everything is createElement/textContent,
 *   so it runs cleanly under the strict CSP (require-trusted-types-for
 *   'script') without registering a Trusted Types policy.
 * - One same-origin fetch: the per-language answer index built by
 *   layouts/index.ask.json (/ask-index.json, /zh/ask-index.json, …). The
 *   request is identical for every visitor — nothing the user types is ever
 *   sent anywhere. All matching happens in the browser.
 *
 * Knowledge base = this site's own verified content:
 * - entries: every page's faq front matter (q/a + source page + country)
 * - countries: roster facts (official URL, fee, agency, last_verified)
 *
 * To add knowledge, edit content front matter or data TOML — never this file.
 */

interface AskEntry {
  q: string;
  a: string;
  u: string; // source page (language-relative URL)
  t: string; // source page title
  c: string; // country key ("" for site-level pages)
  hay?: string; // lazy lowercase haystack: q + t + a + country terms
  qh?: string; // lazy lowercase q
  score?: number;
}

interface AskCountry {
  k: string;
  en: string;
  zh: string;
  zht: string;
  alias: string;
  code: string;
  name: string; // display name in the page language
  form: string;
  fee: string;
  url: string;
  host: string;
  agency: string;
  v: string;
  guide: string;
  htf: string;
  words?: string[]; // lazy lowercase latin match terms
}

interface AskIndex {
  entries: AskEntry[];
  countries: AskCountry[];
}

type Term = { s: string; cjk: boolean };

const CJK = /[\u3400-\u9fff\uf900-\ufaff]/;

// Articles, auxiliaries and pronouns only. Question words ("what", "how") and
// domain words ("free", "official", "fee") are deliberately kept — they carry
// signal in this corpus ("is TDAC free" vs "is TDAC official").
const STOP = new Set([
  'the', 'a', 'an', 'is', 'are', 'am', 'do', 'does', 'did', 'can', 'could',
  'should', 'would', 'i', 'im', 'my', 'me', 'we', 'you', 'your', 'it', 'its',
  'this', 'that', 'there', 'here', 'of', 'to', 'on', 'in', 'at', 'for', 'and',
  'or', 'be', 'been', 'was', 'were', 'will', 'get', 'got', 'have', 'has',
]);

function tokenize(raw: string): Term[] {
  const q = raw.toLowerCase();
  const terms: Term[] = [];
  // Latin / digit runs → whole tokens.
  const latinRuns = q.split(/[^a-z0-9]+/);
  for (const run of latinRuns) {
    if (run.length >= 2 && !STOP.has(run)) terms.push({ s: run, cjk: false });
  }
  // CJK runs → character bigrams (single chars when the run is one long glyph
  // alone). Bigrams keep 境卡/入境 style fragments from matching everything.
  const cjkRuns = q.match(/[\u3400-\u9fff\uf900-\ufaff]+/g) || [];
  for (const run of cjkRuns) {
    if (run.length === 1) {
      terms.push({ s: run, cjk: true });
    } else {
      for (let i = 0; i < run.length - 1; i++) {
        terms.push({ s: run.slice(i, i + 2), cjk: true });
      }
    }
  }
  return terms;
}

function countryMatchTerms(c: AskCountry): string[] {
  if (c.words) return c.words;
  const terms = [c.en, c.code, c.k, c.host, c.zht, c.alias]
    .join(' ')
    .toLowerCase()
    .split(/[^a-z0-9\u3400-\u9fff]+/)
    .filter((w) => w.length >= 2);
  c.words = terms;
  return terms;
}

function detectCountry(terms: Term[], raw: string, countries: AskCountry[]): AskCountry | null {
  let best: AskCountry | null = null;
  let bestScore = 0;
  for (const c of countries) {
    let score = 0;
    for (const t of terms) {
      if (t.cjk) {
        // CJK names are matched whole against the raw query.
        if (c.zh && raw.toLowerCase().includes(c.zh.toLowerCase())) score = Math.max(score, c.zh.length + 2);
        if (c.zht && raw.toLowerCase().includes(c.zht.toLowerCase())) score = Math.max(score, c.zht.length + 2);
        if (c.alias && raw.toLowerCase().includes(c.alias.toLowerCase())) score = Math.max(score, c.alias.length + 2);
      } else if (countryMatchTerms(c).indexOf(t.s) !== -1) {
        // Form codes ("tdac") and hosts score higher than short words ("uk").
        score = Math.max(score, t.s.length >= 4 ? 6 : 3);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}

function search(query: string, index: AskIndex): { entry: AskEntry | null; followups: AskEntry[] } {
  const raw = query.trim().toLowerCase();
  const terms = tokenize(query);
  if (!raw || terms.length === 0) return { entry: null, followups: [] };

  const country = detectCountry(terms, query, index.countries);

  const scored: AskEntry[] = [];
  for (const e of index.entries) {
    if (!e.qh) {
      e.qh = e.q.toLowerCase();
      // Country names joined into the haystack so "thailand fee" matches a
      // Thai FAQ whose question text never says "Thailand".
      e.hay = (e.q + ' ' + e.t + ' ' + e.a + ' ' + countryTermsFor(e.c, index.countries)).toLowerCase();
    }
    let score = 0;
    if (raw.length >= 4) {
      if (e.qh!.indexOf(raw) !== -1) score += 60;
      else if (e.hay!.indexOf(raw) !== -1) score += 30;
    }
    for (const t of terms) {
      const inQ = e.qh!.indexOf(t.s) !== -1;
      const inHay = e.hay!.indexOf(t.s) !== -1;
      if (inQ) score += t.cjk ? 8 : t.s.length >= 4 ? 16 : 10;
      else if (inHay) score += t.cjk ? 5 : t.s.length >= 4 ? 7 : 4;
    }
    if (country && e.c === country.k) score += 25;
    if (score >= 14) {
      e.score = score;
      scored.push(e);
    }
  }
  scored.sort((a, b) => (b.score! - a.score!) || a.q.length - b.q.length);
  return { entry: scored[0] || null, followups: scored.slice(1, 5) };
}

// Country names to append to an entry's haystack so "thailand fee" matches a
// Thai FAQ whose question never says "Thailand".
function countryTermsFor(key: string, countries: AskCountry[]): string {
  const c = countries.find((x) => x.k === key);
  if (!c) return '';
  return c.en + ' ' + c.zh + ' ' + c.zht + ' ' + c.code + ' ' + c.host;
}

// --- tiny DOM helpers (no innerHTML anywhere) ------------------------------

function el(tag: string, cls?: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function link(href: string, text: string, cls: string, external?: boolean): HTMLAnchorElement {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  a.className = cls;
  if (external) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  return a;
}

(() => {
  const root = document.querySelector<HTMLElement>('[data-ask-tool]');
  if (!root) return; // no ask tool on this page → no-op

  const input = root.querySelector<HTMLInputElement>('[data-ask-input]');
  const form = root.querySelector<HTMLFormElement>('[data-ask-form]');
  const results = root.querySelector<HTMLElement>('[data-ask-results]');
  const i18nNode = root.querySelector<HTMLScriptElement>('script[data-ask-i18n]');
  if (!input || !form || !results || !i18nNode) return;

  let i18n: Record<string, string> = {};
  try {
    i18n = JSON.parse(i18nNode.textContent || '{}');
  } catch {
    i18n = {};
  }
  const t = (key: string, fallback: string): string => i18n[key] || fallback;

  // --- state -------------------------------------------------------------

  let index: AskIndex | null = null;
  let loadError = false;
  let lastQuery = '';

  // --- rendering ----------------------------------------------------------

  function renderCountryCard(c: AskCountry): HTMLElement {
    const card = el('div', 'border border-verified rounded-md p-md mb-md not-prose');
    const head = el('div', 'flex items-baseline gap-2 flex-wrap mb-3');
    const name = el('span', 'font-serif font-medium', c.name + ' · ' + c.code);
    head.appendChild(name);
    card.appendChild(head);

    const dl = el('dl', 'grid grid-cols-1 sm:grid-cols-2 gap-x-lg gap-y-2 m-0 text-small');
    const addRow = (label: string, valueNode: Node, mono?: boolean) => {
      const row = el('div', 'flex items-baseline gap-2 min-w-0');
      const dt = el('dt', 'text-meta text-muted font-mono uppercase shrink-0', label);
      const dd = el('dd', 'm-0 min-w-0 break-words' + (mono ? ' font-mono' : ''));
      dd.appendChild(valueNode);
      row.appendChild(dt);
      row.appendChild(dd);
      dl.appendChild(row);
    };
    addRow(t('ask_country_official', 'Official site'), link(c.url, c.host, 'text-verified underline underline-offset-4 font-mono', true));
    addRow(t('ask_country_fee', 'Fee'), el('span', '', c.fee));
    addRow(t('ask_country_agency', 'Run by'), el('span', '', c.agency));
    addRow(t('ask_country_verified', 'Last verified'), el('span', 'font-mono', c.v));
    card.appendChild(dl);

    const nav = el('div', 'mt-3 flex flex-wrap gap-x-md gap-y-2 text-small');
    nav.appendChild(link(c.guide, t('ask_read_guide', 'Read the full guide →'), 'text-ink underline underline-offset-4'));
    nav.appendChild(link(c.htf, t('ask_country_howto', 'How to fill →'), 'text-ink underline underline-offset-4'));
    card.appendChild(nav);
    return card;
  }

  function renderEntry(e: AskEntry, primary: boolean): HTMLElement {
    const wrap = el('article', primary ? 'border border-rule rounded-md p-md not-prose' : 'border border-rule rounded-sm');
    if (primary) {
      wrap.classList.add('bg-white');
    } else {
      wrap.classList.add('p-3');
    }
    const q = el('h3', 'font-semibold m-0 mb-2' + (primary ? ' text-h3' : ' text-small'), e.q);
    wrap.appendChild(q);
    if (primary) {
      const label = el('div', 'text-meta text-muted font-mono uppercase mb-2', t('ask_result_label', 'Answer'));
      wrap.insertBefore(label, q);
      const a = el('p', 'm-0 mb-3', e.a);
      wrap.appendChild(a);
      const src = el('div', 'flex flex-wrap items-baseline gap-x-md gap-y-1 text-small');
      const srcLabel = el('span', 'text-muted', t('ask_source_label', 'Source') + ': ');
      src.appendChild(srcLabel);
      src.appendChild(link(e.u, e.t, 'text-ink underline underline-offset-4'));
      wrap.appendChild(src);
    } else {
      // Follow-up: the question is the clickable control; the answer shows as
      // a muted preview. Clicking re-asks the question verbatim.
      const btn = el('button', 'text-left text-ink underline underline-offset-4 cursor-pointer bg-transparent border-0 p-0 font-semibold', e.q);
      btn.type = 'button';
      btn.addEventListener('click', () => {
        input.value = e.q;
        runSearch(e.q);
      });
      q.remove();
      wrap.insertBefore(btn, wrap.firstChild);
      wrap.appendChild(el('p', 'm-0 mt-2 text-xs text-muted', e.a.slice(0, 160) + (e.a.length > 160 ? '…' : '')));
    }
    return wrap;
  }

  function renderNoMatch(): HTMLElement {
    const box = el('div', 'border border-rule rounded-md p-md not-prose');
    box.appendChild(el('p', 'm-0 mb-3', t('ask_no_match', 'No verified answer matched that question.')));
    box.appendChild(el('p', 'm-0 mb-3 text-small text-muted', t('ask_no_match_hint', 'Try a country name or a form code.')));
    const nav = el('div', 'flex flex-col gap-2 text-small');
    nav.appendChild(link(i18n.decide_url || '/decide/', t('ask_try_decide', 'The 60-second decide tool →'), 'text-ink underline underline-offset-4'));
    nav.appendChild(link(i18n.directory_url || '/official-links/', t('ask_try_directory', 'The official links directory →'), 'text-ink underline underline-offset-4'));
    box.appendChild(nav);
    return box;
  }

  function render(query: string): void {
    results.textContent = '';
    if (!query.trim()) return;
    if (!index) {
      if (loadError) {
        const box = el('div', 'border border-rule rounded-md p-md not-prose');
        box.appendChild(el('p', 'm-0 mb-3', t('ask_error', 'The answer index could not load.')));
        const retry = el('button', 'btn-ink no-underline cursor-pointer border-0', t('ask_retry', 'Retry'));
        retry.type = 'button';
        retry.addEventListener('click', () => loadIndex());
        box.appendChild(retry);
        results.appendChild(box);
      } else {
        results.appendChild(el('p', 'text-small text-muted', t('ask_loading', 'Loading the answer index…')));
      }
      return;
    }

    const { entry, followups } = search(query, index);
    const terms = tokenize(query);
    const country = detectCountry(terms, query, index.countries);

    if (country) results.appendChild(renderCountryCard(country));
    if (entry) results.appendChild(renderEntry(entry, true));
    if (followups.length > 0) {
      const heading = el('div', 'text-meta text-muted font-mono uppercase mt-lg mb-2', t('ask_followups', 'Related questions'));
      results.appendChild(heading);
      const list = el('div', 'grid gap-2');
      for (const f of followups) list.appendChild(renderEntry(f, false));
      results.appendChild(list);
    }
    if (!country && !entry) results.appendChild(renderNoMatch());
  }

  function runSearch(query: string): void {
    lastQuery = query;
    render(query);
  }

  // --- index loading ------------------------------------------------------

  function loadIndex(): void {
    loadError = false;
    if (lastQuery) render(lastQuery);
    fetch(root.dataset.askIndex || '/ask-index.json')
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json() as Promise<AskIndex>;
      })
      .then((data) => {
        index = data;
        const status = root.querySelector<HTMLElement>('[data-ask-status]');
        if (status && typeof data.entries.length === 'number') {
          status.textContent = t('ask_status_indexed', '%d verified answers').replace('%d', String(data.entries.length)).replace('%d', String(data.countries.length));
        }
        if (lastQuery) render(lastQuery);
      })
      .catch(() => {
        loadError = true;
        if (lastQuery) render(lastQuery);
      });
  }

  // --- wiring -------------------------------------------------------------

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    runSearch(input.value);
    input.blur();
  });

  let debounce = 0;
  input.addEventListener('input', () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => runSearch(input.value), 160);
  });

  // "/" focuses the box from anywhere on this page; Esc clears and blurs.
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    const typing = !!target &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
    if (e.key === '/' && !typing) {
      e.preventDefault();
      input.focus();
    } else if (e.key === 'Escape' && target === input) {
      input.value = '';
      runSearch('');
      input.blur();
    }
  });

  // Suggestion chips are rendered server-side from the page's own faq front
  // matter; they are plain buttons, so this page works fully without JS.
  root.querySelectorAll<HTMLButtonElement>('[data-ask-chip]').forEach((chip) => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.askChip || '';
      runSearch(input.value);
      input.focus();
    });
  });

  loadIndex();
})();
