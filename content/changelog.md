---
title: "Changelog"
description: "What changed on entrycardguide.com: government policy updates, new countries, content corrections, and scam-site audits."
date: 2026-04-27
lastmod: 2026-06-17
url: "/changelog/"
---

A running log of substantive updates. We publish a new entry when:

- A government immigration agency changes a form field, fee, or eligibility rule
- A new arrival-card country launches and we cover it
- We find and correct a factual error in an existing guide
- We add or remove a domain from the `scam_sites` list

We do **not** log every typo fix or layout tweak. For that, see [the git history](https://github.com/onlyoasis/entrycardguide/commits/main).

---

## 2026-06-17 - URL verification dates corrected for unchanged official links

Re-checked official URL records that stayed unchanged in the June address audit and updated their `last_verified` dates instead of leaving the older April dates in place.

- Updated: Malaysia MDAC, Mexico FMM-E, Singapore SGAC, Indonesia All Indonesia / e-VOA, Philippines eTravel, Cambodia e-Arrival, Visit Japan Web, Korea e-Arrival Card
- Updated: Thailand TDAC main portal and Vietnam's two current e-visa domains
- Left unchanged: URLs that still returned 403 or failed DNS during this follow-up check, so we do not mark them freshly verified without evidence

---

## 2026-06-11 - Philippines, Cambodia, Japan, Korea added; Indonesia and Vietnam URLs refreshed

Added four country guides and refreshed official URL data for Indonesia and Vietnam after a live address audit.

- New: `/philippines/`, `/cambodia/`, `/japan/`, `/korea/`
- New: English and Chinese country hubs, form guides, field guides, official-site explainers, rules JSON, field TOML, official URL TOML, and country changelogs
- Updated: Indonesia now points travelers to `allindonesia.imigrasi.go.id` for the unified arrival declaration and `evisa.imigrasi.go.id` for e-VOA
- Updated: Vietnam now uses `evisa.gov.vn` as the primary e-visa URL, with `thithucdientu.gov.vn` recorded as an official alternate
- Removed: DNS-dead active warning cards for `thailand-tdac.com` and `vietnam-visa-online.com`
- Updated: site navigation and decision tool now cover 11 countries

---

## 2026-04-27 - Methodology and freshness signals added

Added a public methodology section to `/about/`, a longer `/trust/` page, and visible freshness signals in the article rail. The rail now shows when each guide was last reviewed and links back to this changelog.

- New: `/trust/`, `/zh/trust/`, `/changelog/`, `/zh/changelog/`
- Updated: `/about/`, `/zh/about/`, article rail freshness badge
- Added: monthly maintenance checklist and per-country changelog TOML files

---

## 2026-04-26 - Vietnam, Indonesia, Singapore added

Added three countries with full English and Chinese coverage. Vietnam is the first country covered where the underlying form has a real government fee, so the framing is "middlemen overcharge" rather than "free form sold for money."

- New: `/vietnam/`, `/indonesia/`, `/singapore/`
- New: country guide, how-to-fill, and iVisa/offical-site explainer for each
- Updated: site navigation now lists seven countries

---

## 2026-04-26 - Scam-site DNS audit

Re-audited known scam-site domains and removed dead entries instead of keeping stale warnings. Commit [`6c841f3`](https://github.com/onlyoasis/entrycardguide/commit/6c841f3) removed 13 domains that failed DNS checks.

- Updated: `data/official_urls/*.toml`
- Policy: only list domains that resolve at audit time and have documented evidence

---

## 2026-04-25 - SEO output checks and sitemap validation

Added automated output checks for robots.txt and sitemap generation after the Cloudflare Pages build. This protects Google Search Console setup from regressions.

- New: `scripts/check-seo-output.mjs`
- Updated: GitHub Actions now runs SEO checks after production build
- Verified: root sitemap index and localized sitemaps render correctly

---

## 2026-04-22 - Thailand TDAC added

First country published. Covers the full TDAC flow at `tdac.immigration.go.th`, documents the iVisa middleman situation publicly named by Thai immigration in March 2026, and includes an in-browser validator.

- New: `/thailand/tdac/`, `/thailand/how-to-fill/`, `/thailand/is-ivisa-official/`
- New: `data/official_urls/thailand.toml`, `data/rules/thailand.json`

---

## How to read the audit dates

Each country's TOML at `data/official_urls/{country}.toml` has a `last_verified` field. That field updates whenever we re-check the official URL against the live site. If you see a guide reviewed more than 90 days ago, treat it as potentially stale and verify against the official site before relying on it.
