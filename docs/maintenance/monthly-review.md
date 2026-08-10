# Monthly content review

This recurring task keeps entrycardguide.com's content credible. Run it once a month. Estimated time: 30-45 minutes.

For the traffic side of the review, pull GSC and GA4 first with `npm run fetch:search-data` —
see `search-data-api.md` for the one-time credential setup.

## What to check

For each country, in this order:

1. **Visit the official site listed in the country's TOML.** Confirm:
   - The URL still resolves.
   - The form fields have not changed compared with `data/rules/{country}.json`.
   - No new fee has been added.
   - No new exemptions or eligibility changes were announced.

2. ~~DNS-audit the `scam_sites` list.~~ **No longer part of the review.** The site
   stopped publishing middleman and lookalike-site listings on 2026-08-10. The
   `[[scam_sites]]` arrays remain in the TOML files as an internal record, but
   nothing renders them, so there is no published claim to keep current. Do not
   re-introduce named third parties into the guides.

3. **Update verification dates.** For each TOML and each `data/rules/*.json` file reviewed, update the relevant verification date to today.

4. **Update `lastmod`.** If the underlying policy did not change but the guide was reviewed, update `lastmod` on the relevant country pages.

5. **Add a changelog entry.** Even if nothing changed, add:

   ```markdown
   ## 2026-MM-DD - Monthly review

   No policy changes this cycle. All country guides re-verified against live official sites.
   ```

## Cadence

- **Monthly:** run the checklist above.
- **Quarterly:** re-read each country's main guide and iVisa/offical-site explainer to confirm the framing still matches current search results and scam patterns.
- **Annually:** evaluate new countries with digital arrival cards or e-visas that show the same scam pattern.

## Why this matters

1. **Google freshness ranking.** Visible `lastmod`, review age, and changelog links help crawlers understand that the guides are maintained.
2. **Reader trust.** "Last reviewed 12 days ago" is a stronger signal than a generic promise that the site is kept up to date.

## When an official URL changes

Treat it as urgent:

1. Update the country TOML immediately.
2. Update affected guide copy and validator links.
3. Open a PR titled `fix(urgent): {country} official URL changed`.
4. Ship same day.
5. Add a prominent changelog entry explaining the old URL, new URL, and verification date.
