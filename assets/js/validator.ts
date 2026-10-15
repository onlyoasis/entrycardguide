/**
 * Client-side field validator.
 *
 * v1.0 design constraints:
 * - ZERO network requests. Ever. Runs entirely in the browser.
 * - ZERO npm dependencies. Bundled via Hugo's js.Build pipe.
 * - Rules sourced from <script type="application/json" id="validator-rules">
 *   which is populated at build time from data/rules/{country}.json
 * - One instance per validator shortcode on the page.
 *
 * To add a new country:
 * 1. Create data/rules/{country}.json matching ThailandRules shape
 * 2. Update layouts/shortcodes/validator.html to pipe it through jsonify
 * 3. No code changes needed here — rules drive everything
 *
 * The checks themselves live in ./lib/field-check.ts (pure, unit-tested). A
 * rule can carry the official form's regex (`pattern`), a date `format` and a
 * date window in days from today; see that file.
 */

import { sheetItem, type SheetItem } from './lib/prefill';
import { validateField, type CountryRules, type ValidationResult } from './lib/field-check';

function byId(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function loadRules(container: HTMLElement): CountryRules | null {
  const script = container.querySelector<HTMLScriptElement>(
    'script[type="application/json"].validator-rules'
  );
  if (!script || !script.textContent) return null;
  try {
    return JSON.parse(script.textContent) as CountryRules;
  } catch (e) {
    console.warn('validator: rules JSON parse failed', e);
    return null;
  }
}

// ------ DOM wiring ------

function renderState(row: HTMLElement, result: ValidationResult, ui: { fix: string; ok: string }) {
  const state = row.querySelector<HTMLElement>('.validator-state');
  const err = row.querySelector<HTMLElement>('.validator-err-msg');
  if (!state) return;

  state.classList.remove('ok', 'err');
  if (!result.ok && result.message) {
    state.classList.add('err');
    state.textContent = ui.fix;
    if (err) {
      err.textContent = result.message;
      err.style.display = '';
    }
  } else if (result.ok) {
    state.classList.add('ok');
    state.textContent = ui.ok;
    if (err) {
      err.textContent = '';
      err.style.display = 'none';
    }
  } else {
    // empty + not required
    state.classList.remove('ok', 'err');
    state.textContent = '';
    if (err) {
      err.textContent = '';
      err.style.display = 'none';
    }
  }
}

function wireValidator(container: HTMLElement) {
  const rules = loadRules(container);
  if (!rules) {
    console.warn('validator: no rules found for', container);
    return;
  }
  const ui = rules.ui ?? { fix: 'Fix ✗', ok: 'OK ✓' };

  const rows = container.querySelectorAll<HTMLElement>('.validator-row[data-field]');
  rows.forEach((row) => {
    const fieldName = row.dataset.field;
    if (!fieldName) return;
    const rule = rules.fields[fieldName];
    if (!rule) return;

    const input = row.querySelector<HTMLInputElement>('input');
    if (!input) return;

    const runCheck = () => {
      const result = validateField(input.value, rule);
      renderState(row, result, ui);
    };

    input.addEventListener('input', runCheck);
    input.addEventListener('blur', runCheck);
    // Run once on init if input has a default value
    if (input.value) runCheck();
  });

  wireSheet(container, rules, ui);
}

// ------ Copy sheet (only rendered for countries in params.prefill_sheet) ------

interface SheetStrings {
  copy: string;
  copied: string;
  missing: string;
  fix: string;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API needs a secure context; fall back to a hidden textarea.
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.className = 'sr-only';
  document.body.append(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

function renderSheetItem(label: string, item: SheetItem, strings: SheetStrings): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'validator-sheet-item';
  const name = document.createElement('div');
  name.className = 'text-xs text-muted';
  name.textContent = label;
  li.append(name);

  if (item.status !== 'ok') {
    const note = document.createElement('div');
    note.className = 'text-xs text-scam';
    note.textContent = item.status === 'missing' ? strings.missing : `${strings.fix}${item.message ?? ''}`.trim();
    li.append(note);
    return li;
  }

  const row = document.createElement('div');
  row.className = 'validator-sheet-row';
  const value = document.createElement('code');
  value.className = 'validator-sheet-value';
  value.textContent = item.value;
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'validator-sheet-copy';
  copy.textContent = strings.copy;
  copy.setAttribute('aria-label', `${strings.copy}: ${label}`);
  copy.addEventListener('click', () => {
    void copyText(item.value).then((ok) => {
      if (!ok) return;
      copy.textContent = strings.copied;
      window.setTimeout(() => {
        copy.textContent = strings.copy;
      }, 1500);
    });
  });
  row.append(value, copy);
  li.append(row);
  return li;
}

function wireSheet(container: HTMLElement, rules: CountryRules, ui: { fix: string; ok: string }) {
  const button = container.querySelector<HTMLButtonElement>('[data-sheet-build]');
  const sheet = container.querySelector<HTMLElement>('[data-sheet]');
  const list = sheet?.querySelector<HTMLOListElement>('[data-sheet-list]');
  if (!button || !sheet || !list) return;

  const strings: SheetStrings = {
    copy: sheet.dataset.copy || 'Copy',
    copied: sheet.dataset.copied || 'Copied',
    missing: sheet.dataset.missing || 'Not filled in yet',
    fix: sheet.dataset.fix || 'Fix this first: ',
  };

  button.addEventListener('click', () => {
    list.replaceChildren();
    container.querySelectorAll<HTMLElement>('.validator-row[data-field]').forEach((row) => {
      const rule = row.dataset.field ? rules.fields[row.dataset.field] : undefined;
      const input = row.querySelector<HTMLInputElement>('input');
      if (!rule || !input) return;
      const result = validateField(input.value, rule);
      // Show the same verdict on the row, so a "fix" in the sheet is easy to find.
      if (input.value.trim() || rule.required) renderState(row, result, ui);
      const item = sheetItem(rule.type, Boolean(rule.required), input.value, result);
      if (item.status !== 'skip') list.append(renderSheetItem(rule.label, item, strings));
    });
    sheet.hidden = false;
    sheet.focus();
  });
}

function init() {
  const containers = document.querySelectorAll<HTMLElement>('.validator[data-country]');
  containers.forEach(wireValidator);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose for debugging only — no global network surface
(window as any).__entrycardguide_validator = { validateField };
