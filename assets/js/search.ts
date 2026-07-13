/**
 * Homepage country search — filters the §02 country grid + mobile list entirely
 * in the browser.
 *
 * v1.0 design constraints (same as validator.ts / decide.ts):
 * - ZERO network requests. Runs entirely client-side.
 * - ZERO npm dependencies. Bundled via Hugo's js.Build pipe.
 * - No innerHTML / no DOM injection, so nothing touches a Trusted Types sink —
 *   it runs cleanly under the strict CSP (require-trusted-types-for 'script').
 *   It only toggles style.display, the `hidden` attribute, textContent, and
 *   <details>.open, none of which are script sinks.
 *
 * Searchable text per country lives in each card's data-search attribute
 * (english name, chinese name, form code, key, official host), built at build
 * time from the country roster. Adding a country needs no change here.
 *
 * Progressive enhancement: with JS off the input is inert and every country
 * stays visible.
 */
(() => {
  const input = document.querySelector<HTMLInputElement>('[data-country-search-input]');
  if (!input) return; // no search box on this page -> no-op

  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-country-card]'));
  if (!cards.length) return;

  const empty = document.querySelector<HTMLElement>('[data-country-empty]');
  const details = document.querySelector<HTMLDetailsElement>('[data-country-more]');

  // Swap the mobile expander label as it opens/closes — whether the user clicked
  // it or a search opened it. textContent only, never innerHTML.
  const summary = details ? details.querySelector<HTMLElement>('summary') : null;
  if (details && summary) {
    const closedLabel = summary.textContent || '';
    const openLabel = summary.dataset.labelOpen || closedLabel;
    details.addEventListener('toggle', () => {
      summary.textContent = details.open ? openLabel : closedLabel;
    });
  }

  const normalize = (s: string): string => s.trim().toLowerCase();

  function apply(query: string): void {
    const q = normalize(query);
    let anyMatch = false;
    for (const card of cards) {
      const haystack = card.dataset.search || '';
      const match = q === '' || haystack.indexOf(q) !== -1;
      card.style.display = match ? '' : 'none';
      if (match) anyMatch = true;
    }
    // While searching, open the mobile expander so a hit past the top 10 surfaces.
    if (details) details.open = q !== '';
    // Empty-state line only when the user typed something and nothing matched.
    if (empty) empty.hidden = !(q !== '' && !anyMatch);
  }

  input.addEventListener('input', () => apply(input.value));

  // "/" focuses the box from anywhere; Esc clears and blurs it.
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    const typing = !!target &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
    if (e.key === '/' && !typing) {
      e.preventDefault();
      input.focus();
    } else if (e.key === 'Escape' && target === input) {
      input.value = '';
      apply('');
      input.blur();
    }
  });
})();
