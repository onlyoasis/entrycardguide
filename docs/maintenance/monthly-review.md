# Monthly content review

This recurring task keeps entrycardguide.com's content credible. Run it once a month. Estimated time: 30-45 minutes.

## What to check

For each country, in this order:

1. **Visit the official site listed in the country's TOML.** Confirm:
   - The URL still resolves.
   - The form fields have not changed compared with `data/rules/{country}.json`.
   - No new fee has been added.
   - No new exemptions or eligibility changes were announced.

2. **DNS-audit the `scam_sites` list.**

   ```bash
   for d in $(grep -h "^domain = " data/official_urls/*.toml | sort -u | sed 's/domain = "//; s/"//'); do
     ip=$(dig +short +time=2 +tries=1 "$d" | tail -1)
     [ -n "$ip" ] && echo "OK $d" || echo "DEAD $d"
   done
   ```

   Remove dead domains using the same policy as commit `6c841f3`: fewer live warnings are better than stale warnings.

3. **Check for new public scam-site announcements.** Search Google News for:
   - `"thailand immigration" warning`
   - `"INM mexico" official site warning`
   - `"DGM dominican republic" scam`
   - `"jabatan imigresen" malaysia warning`
   - `"vietnam immigration" e-visa scam`
   - `"bea cukai" scam warning`
   - `"imigrasi indonesia" scam warning`
   - `"ICA singapore" scam warning`

   Add newly named domains to the appropriate TOML `scam_sites` array with the source summarized in `evidence`.

4. **Update verification dates.** For each TOML and each `data/rules/*.json` file reviewed, update the relevant verification date to today.

5. **Update `lastmod`.** If the underlying policy did not change but the guide was reviewed, update `lastmod` on the relevant country pages.

6. **Add a changelog entry.** Even if nothing changed, add:

   ```markdown
   ## 2026-MM-DD - Monthly review

   No policy changes this cycle. All country guides re-verified against live official sites. Scam-site DNS audit clean.
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
