# Task 06 — Add a changelog page + content freshness signals

**Status:** completed
**Completed by:** Codex
**Completed on:** 2026-04-27
**Estimated time:** 3–5 hours initial setup, then ~30 min/month ongoing
**Difficulty:** ⭐⭐ (light Hugo work + some monitoring discipline)
**Skills needed:** Hugo template editing, basic markdown, ability to monitor government immigration news

## What this task is

Google ranks "fresh" content higher for queries that have a recency component (`thailand TDAC 2026`, `mexico FMM rules`, `singapore arrival card update`). Right now the site has dates in front matter (`lastmod`) but no visible signal that content is regularly updated. The result: from Google's perspective, our pages could be 3-year-old static guides.

This task does three things:

1. **A `/changelog/` page** that lists site updates by date, in reverse chronological order.
2. **A "Last reviewed" badge** in the article rail that shows the most recent verification date and color-codes by freshness.
3. **A monthly review cadence** documented for whoever maintains the site, so the dates stay accurate and the changelog stays populated.

When a Google crawler hits a page and sees:
- Last reviewed: 12 days ago (green badge)
- Linked changelog with multiple entries this quarter

— it's a much stronger freshness signal than `lastmod: 2026-04-26` buried in front matter.

## What you'll deliver

1. **`content/changelog.md`** with structured entries
2. **`layouts/freshness/single.html`** (custom render hook for changelog entries) — optional, uses default if skipped
3. **Article-rail update** showing freshness badge with traffic-light coloring
4. **Monthly review checklist** in `docs/maintenance/monthly-review.md`
5. **Per-country `data/changelog/*.toml`** (optional, allows machine-readable changelog data for future use)

## Step 1: Create the changelog page

`content/changelog.md`:

```markdown
---
title: "Changelog"
description: "What changed on entrycardguide.com — government policy updates, new countries, content corrections."
date: 2026-04-26
lastmod: 2026-04-26
url: "/changelog/"
---

A running log of substantive updates. We try to publish a new entry whenever:

- A government immigration agency changes a form field, fee, or eligibility rule
- A new arrival-card country launches and we cover it
- We find a factual error in an existing guide and correct it
- We add or remove a domain from the scam_sites list

We do **not** log every typo fix or layout tweak. For that, see [the git history](https://github.com/onlyoasis/entrycardguide/commits/main).

---

## 2026-04-26 — Vietnam, Indonesia, Singapore added

Three new countries, with full Chinese translation. Vietnam's e-visa is the
first country we cover where the underlying form has a real government fee
($25 USD); the framing is "middlemen overcharge" rather than "free form
sold for money."

- New: `/vietnam/`, `/indonesia/`, `/singapore/` and their three sub-articles each
- Updated: site menu now lists 7 countries

---

## 2026-04-22 — Thailand TDAC added

First country published. Covers the full TDAC flow at `tdac.immigration.go.th`,
documents the iVisa middleman situation publicly named by Thai immigration in
March 2026.

- New: `/thailand/tdac/`, `/thailand/how-to-fill/`, `/thailand/is-ivisa-official/`
- Initial scam_sites list: 4 entries (later audited; see 2026-04-26 entry below)

---

## How to read the audit dates

Each country's TOML at `data/official_urls/{country}.toml` has a
`last_verified` field. That field updates whenever we re-check the official URL
against the live site. If you see `last_verified` more than 90 days ago,
consider the page "potentially stale" and verify against the official site
yourself before relying on it.
```

Add new entries at the top whenever a substantive change ships.

### Entry format

Each entry uses `## YYYY-MM-DD — Title` (H2). This keeps them parseable for the changelog-list page if you build one.

Body should be ≤ 150 words. Concrete: name files added, name TOMLs updated, name the policy change. Avoid generic "improved content" entries.

## Step 2: Add a freshness badge to article-rail

Edit `layouts/partials/article-rail.html`. After the existing `Source of Truth` block, replace the `Last verified` section with:

```html
{{- with .Lastmod }}
{{- $age := now.Sub . }}
{{- $days := math.Floor (div $age.Hours 24) }}
{{- $tone := "verified" }}
{{- if gt $days 90 }}{{ $tone = "stale" }}{{ end }}
{{- if gt $days 365 }}{{ $tone = "very-stale" }}{{ end }}
<div class="py-2 border-b border-rule border-dotted" data-freshness="{{ $tone }}">
  <span class="block text-xs text-muted font-mono uppercase tracking-wide2">{{ i18n "rail_last_verified" }}</span>
  <span class="text-small">{{ dateFormat "January 2, 2006" . }}</span>
  <span class="block text-xs mt-1
    {{- if eq $tone "verified" }} text-verified{{ end }}
    {{- if eq $tone "stale" }} text-mark{{ end }}
    {{- if eq $tone "very-stale" }} text-scam{{ end }}">
    {{ $days }} {{ i18n "freshness_days_ago" }}
  </span>
  <span class="rail-verified mt-2 block">{{ i18n "verified_badge" }}</span>
</div>
{{- end }}
```

Add to `i18n/en.yaml`:
```yaml
freshness_days_ago: "days ago"
```

`i18n/zh.yaml`:
```yaml
freshness_days_ago: "天前更新"
```

Also add a link to the full changelog at the bottom of the article rail:

```html
<div class="border-t-2 border-ink pt-md mb-xl">
  <h4 class="font-mono text-meta uppercase text-muted mb-3 font-medium">{{ i18n "rail_freshness" }}</h4>
  <p class="text-small text-muted leading-relaxed">{{ i18n "rail_freshness_explainer" }}
    <a href="{{ "/changelog/" | relLangURL }}" class="text-ink">{{ i18n "rail_see_changelog" }} →</a></p>
</div>
```

i18n strings:
```yaml
# en.yaml
rail_freshness: "Freshness"
rail_freshness_explainer: "We re-verify each guide against the live government site every 30 days."
rail_see_changelog: "See changelog"

# zh.yaml
rail_freshness: "新鲜度"
rail_freshness_explainer: "我们每 30 天对照政府官方站重新核对每份指南。"
rail_see_changelog: "查看变更日志"
```

## Step 3: Per-country machine-readable changelog (optional, recommended)

`data/changelog/thailand.toml`:

```toml
# Thailand changelog. Append to this file when Thai immigration policy changes.
# Format:
#   [[entries]]
#   date = "2026-04-22"
#   summary = "Brief description"
#   detail = "Optional longer explanation"

[[entries]]
date = "2026-04-22"
summary = "Initial coverage published"
detail = "Covers TDAC at tdac.immigration.go.th. Initial scam_sites list of 4 entries (later audited)."
```

Same for the other 6 countries. This data file format means you can later auto-generate per-country changelog summaries on each country hub page if you want.

## Step 4: Document the monthly review cadence

`docs/maintenance/monthly-review.md`:

```markdown
# Monthly content review

This is the recurring task that keeps entrycardguide.com's content credible.
Run it once a month. Estimated time: 30-45 minutes.

## What to check

For each of the 7 countries, in this order:

1. **Visit the official site listed in the country's TOML.** Confirm:
   - The URL still resolves.
   - The form fields haven't changed (compare against `data/rules/{country}.json`).
   - No new fee has been added.
   - No new exemptions or eligibility changes.

2. **DNS-audit the scam_sites list.**
   ```bash
   for d in $(grep -h "^domain = " data/official_urls/*.toml | sort -u | sed 's/domain = "//; s/"//'); do
     ip=$(dig +short +time=2 +tries=1 "$d" | tail -1)
     [ -n "$ip" ] && echo "✓ $d" || echo "✗ $d (DEAD)"
   done
   ```
   Remove any DEAD domains following the procedure used in commit `6c841f3`.

3. **Check for new public scam-site announcements.** Search Google News for:
   - `"thailand immigration" warning`
   - `"INM mexico" official site warning`
   - `"DGM dominican republic" scam`
   - `"jabatan imigresen" malaysia warning`
   - `"vietnam immigration" e-visa scam`
   - `"bea cukai" or "imigrasi indonesia" scam warning`
   - `"ICA singapore" scam warning`

   Add any newly-named domains to the appropriate TOML's `scam_sites` array,
   with the news source linked in the `evidence` field.

4. **Update `last_verified` dates.** For each TOML and each `data/rules/*.json`
   you reviewed, update the date to today.

5. **Update `lastmod` on each country's main intro article** if the underlying
   policy hasn't changed but you've reviewed it.

6. **Add a changelog entry.** Even if nothing changed, write:
   ```
   ## 2026-MM-DD — Monthly review
   No policy changes this cycle. All 7 country guides re-verified against the
   live official sites. Scam_sites DNS audit clean.
   ```

## Cadence

- **Monthly:** the steps above.
- **Quarterly (every 3rd month):** also re-read each country's main intro and
  is-ivisa article to confirm the framing still matches the current scam
  landscape. Tone-check.
- **Annually:** consider adding new countries (Cambodia, Sri Lanka, Philippines
  digital arrival cards are likely candidates as of 2026).

## Why this matters

Two reasons:

1. **Google freshness ranking.** Pages that update have higher ranking decay
   protection than pages that go stale. The `lastmod` and changelog signals
   are how Google knows.

2. **Trust signal for readers.** "Last reviewed 12 days ago" with a green
   badge is the strongest credibility signal we can offer. Readers do notice.
   The validator's `lastVerified` field is similarly used by Google for
   schema-rich-results decisions.

## When something is broken

If you find that an official URL has changed (e.g. Thailand moves from
`tdac.immigration.go.th` to a new subdomain), this is a P0:

1. Update the TOML immediately.
2. Open a PR titled `fix(URGENT): {country} official URL changed`.
3. Push to main same-day.
4. Add a changelog entry with prominence (use `## 🚨 YYYY-MM-DD` to call
   attention).
```

## Step 5: Add structured data for the changelog page

In `layouts/partials/head.html`, add this block at the appropriate place
(near other JSON-LD schemas):

```html
{{- /* CollectionPage / ChangeLog schema for the changelog page */ -}}
{{- if eq .Section "changelog" }}{{ else if eq .RelPermalink "/changelog/" }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": {{ .Title | jsonify }},
  "description": {{ .Description | jsonify }},
  "datePublished": {{ .PublishDate.Format "2006-01-02" | jsonify }},
  "dateModified": {{ .Lastmod.Format "2006-01-02" | jsonify }},
  "publisher": {
    "@type": "Organization",
    "name": {{ .Site.Title | jsonify }},
    "url": "https://entrycardguide.com/"
  }
}
</script>
{{- end }}
```

This tells Google the page is a maintained content collection that updates over time.

## Acceptance criteria

This task is done when:

1. **`/changelog/` and `/zh/changelog/` exist and render.** At least one entry per language.
2. **Article-rail shows freshness badge** on every article page with traffic-light coloring (green if < 90 days, yellow 90-365, red > 365).
3. **Article-rail links to the changelog** with the i18n string.
4. **`docs/maintenance/monthly-review.md` is committed** with the review checklist.
5. **`data/changelog/*.toml` files exist for all 7 countries** (even if minimal — empty `[[entries]]` is fine).
6. **Local build passes:** `npm run build:prod && npm run check:seo`
7. **Open a PR** with title `feat: add changelog page and freshness signals`. CI green.

## Out of scope (do not do)

- Don't auto-generate changelog from git commits. The signal-to-noise is wrong.
  We only want substantive content updates, not "fix typo" or "update CSS."
- Don't add a "subscribe to changelog" RSS feed. Hugo generates one
  automatically; if you want to surface it, add a small RSS link in the rail,
  but don't build email subscription infrastructure.
- Don't overengineer the freshness logic. Three buckets (verified / stale /
  very-stale) is enough. Don't add 5 colors or a numeric "freshness score."
- Don't backdate changelog entries to fake activity. If the site went two
  months without an update, the changelog should reflect that.

When you're done, update this file with your name and the merge date.
