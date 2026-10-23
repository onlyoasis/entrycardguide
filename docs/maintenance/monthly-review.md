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

   - If `data/photo_specs/{country}.toml` exists, open each form's `source` page and compare the photo size, pixel range, file-size limit and formats. Change only numbers the official page publishes, then set that form's `checked` date. Run `npm run sync:zh-hant` after editing any `note_zh`.

   - Read the latest entry requirement quote report (see [Entry requirement quotes](#entry-requirement-quotes) below) and work through every item it lists for the country.

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

## Entry requirement quotes

`npm run check:entry-quotes` re-fetches every `source` in `data/entry_requirements/*.toml` and checks that its `quote` is still on the page. It fetches like curl with a browser user agent, reads PDFs with `pdftotext -layout` (install poppler), strips scripts, styles and tags from HTML, and compares after NFKC, straight quotes and hyphens, collapsed whitespace and lower case. A quote that only matches once punctuation is removed still counts as found. Each failed fetch gets one retry. Pass country keys to check a few (`npm run check:entry-quotes -- japan thailand`) and `--out DIR` to write `entry-quotes.md` and `entry-quotes.json`.

The weekly **Verify official URLs** workflow runs it as a separate report-only job. Open the run's summary, or download the `entry-quotes-report` artifact (kept 90 days). The job never commits, never deploys and cannot fail the URL job.

How to read it:

| Section | Meaning | What to do |
| --- | --- | --- |
| found | Quote still on the page | Nothing |
| Quote missing | Page fetched, quote not there. The number is the share of the quote's 4-word runs (6 characters for CJK) still present: about 0.8+ is reworded, under 0.4 means the passage is gone | Open the page and find the passage |
| Fetch failed | HTTP error, timeout or too little text, after the retry | Run it again later; if it keeps failing, open the page in a browser |
| Manual review | Source is on the browser-only list in `scripts/helpers/entry-quotes.mjs` (curl gets 403, times out, or the page needs JavaScript) | Open it in a browser and look for the quote. Do not try to get past a captcha or bot check |

On 2026-10-23 the full run gave 179 items: 149 found, 0 missing, 29 manual review (items citing the 18 browser-only sources) and 1 fetch failed (`mfa.gov.az` timed out from that machine; the research run read it on the same day). An earlier run that day also saw one-off 520, 503 and TLS errors on three other sources; the retry is there for those.

When a quote is missing:

1. Read the page. If the same rule is still there in new words, copy the new wording into `quote` exactly as the page shows it. If the page moved, update `source` to the new official https page.
2. If the rule itself changed (months, pages, amount, status), update the item's values and notes from the new text, then run `npm run sync:zh-hant` for the `*_zh_hant` fields. Add a changelog entry and bump the country page `lastmod`.
3. If no official page states the rule any more, delete the item. Do not keep a value without a quote.
4. Set `checked` at the top of the file to the review date, run the check again for that country, and build: `layouts/partials/entry-req-rows.html` fails the build on a missing `source` or `quote`.

If a source moves onto or off the browser-only list, edit `BROWSER_ONLY` and `BROWSER_READ_DATE` in `scripts/helpers/entry-quotes.mjs`.

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
