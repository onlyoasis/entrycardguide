/**
 * Nav dropdown dismissal — the header's "Countries" menu and the language
 * switcher are native <details> elements (chosen for a zero-JS, progressive-
 * enhancement base). A native <details> only toggles when you click its own
 * <summary>; it has no "click outside to close" behaviour, so an opened menu
 * stays open until the summary is clicked again — clicking anywhere else does
 * nothing. This adds the missing behaviour: a click outside an open menu, or
 * the Escape key, closes it.
 *
 * Same v1.0 constraints as validator.ts / search.ts:
 * - ZERO network requests, ZERO npm dependencies (bundled via Hugo js.Build).
 * - No innerHTML / no DOM injection — it only sets <details>.open, which is not
 *   a Trusted Types sink, so it runs cleanly under the strict CSP.
 *
 * Scope: only [data-nav-dropdown] elements (the two header menus). The mobile
 * country expander in search.ts ([data-country-more]) is deliberately excluded —
 * that's an inline content expander, not a pop-up menu, and should stay open.
 *
 * Progressive enhancement: with JS off, the menus still open and close via the
 * native summary toggle; they just don't auto-close on an outside click.
 */
(() => {
  const dropdowns = Array.from(
    document.querySelectorAll<HTMLDetailsElement>('[data-nav-dropdown]'),
  );
  if (!dropdowns.length) return; // no nav dropdowns on this page -> no-op

  // A click outside an open dropdown closes it. Because clicking a second
  // menu's summary lands outside the first one, this also makes the two menus
  // mutually exclusive: opening one closes the other.
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as Node | null;
    for (const d of dropdowns) {
      if (d.open && !(target && d.contains(target))) d.open = false;
    }
  });

  // Escape closes any open dropdown.
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    for (const d of dropdowns) if (d.open) d.open = false;
  });
})();
