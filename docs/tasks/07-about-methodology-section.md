# Task 07 — Add a methodology section to the About page

**Status:** completed
**Completed by:** Codex
**Completed on:** 2026-04-27
**Estimated time:** 1.5 hours
**Difficulty:** ⭐⭐ (mostly writing; the technical pattern already exists)
**Skills needed:** Hugo markdown editing, fluent in both EN and ZH (or a willingness to use a translator carefully)

## What this task is

The site's biggest competitive advantage isn't its design or its writing — it's that **every claim is verifiable**. The TOML files. The `lastVerified` dates. The DNS audit policy. The git history. The validator that runs in your browser. The `data/rules/*.json` field specs scraped from official forms.

Right now this story is buried. The current `about.md` has a short "How to verify any claim on this site" section, but it's three bullet points hidden mid-page. Most readers never get there.

This task pulls that story to the surface and turns it into the **strongest credibility signal on the site**.

The goal: a careful reader, after reading this section, walks away thinking "ok, this isn't a normal travel blog. This is a small piece of public infrastructure." That mental shift drives:

- Higher trust → higher conversion on affiliate links (task 04)
- More backlinks from journalists / NGOs / consumer protection sites
- Lower bounce rate (people stay to verify the verifiable claims)

## What you'll deliver

1. **A new section** in `content/about.md` titled "Our methodology" (or a more interesting noun phrase — see writing guidance below)
2. **Same section, real translation** in `content/about.zh.md`
3. **A new `/trust/` page** (optional, recommended) that's a longer-form expansion of the methodology, linked from the about page summary
4. **Internal cross-links** from at least three high-traffic articles pointing to the methodology section

## Step 1: Plan the methodology section

The section should cover **five distinct things we actually do**, each with a verifiable artifact a reader can click into. Not generic "we care about quality" — specific, auditable processes.

Here's the inventory of what we actually do (rewrite in your voice; don't copy):

### 1. Official URLs are stored in versioned TOML, not hardcoded in templates

Every official government URL the site references lives in
`data/official_urls/{country}.toml`. Each entry has:
- The URL itself
- The agency that operates it
- A `last_verified` ISO date
- An optional `archive_url` pointing to a Wayback Machine snapshot from
  that verification date
- A free-text `notes` field explaining domain-suffix restrictions (e.g. why
  `.go.th` is government-only)

This means: when a reader is unsure if `tdac.immigration.go.th` is currently the right URL, they can:
1. Click through to the GitHub TOML file
2. See the date we last verified it
3. Click the archive_url to see the live site at that date
4. Compare with what they see today

Three independent verification paths, all accessible without trusting us.

### 2. Field validation rules are scraped from the live forms, stored as JSON

`data/rules/{country}.json` contains the structural spec for every field on every official arrival form: max length, regex patterns, error messages the actual government site returns when you violate the rules. These rules drive the in-browser validator widget.

We don't make these up. We open the official site, inspect the HTML attributes
on each input, copy them into the JSON. This means:
- The validator can't tell users something the official site won't enforce
- If the official site changes a field rule, we know because the JSON drifts
- A reader can compare our JSON against the live form themselves

### 3. The scam_sites list is DNS-audited

Each TOML's `[[scam_sites]]` array lists known commercial middlemen. Every entry on this list:
- Resolves via DNS at the time we add it (we run `dig` to confirm)
- Has documented evidence (a date observed, a description of the scheme)
- Is referenced by public news or government warnings where available

Domains that don't resolve get removed. This is policy, not aspiration —
the [2026-04-26 commit](https://github.com/onlyoasis/entrycardguide/commit/6c841f3) removed 13 domains that failed DNS audit; the site shipped fewer-but-real warnings instead of more-but-fictional ones.

### 4. The validator runs 100% in your browser

Open DevTools → Network tab → fill the validator → submit. **Zero outbound network requests.** The rules are embedded in the page as a `<script type="application/json">` block, parsed client-side, and the validation happens against the data you typed.

We do not log keystrokes. We do not store partial submissions. We do not phone home with telemetry. The source code for the validator is at `assets/js/validator.ts` — readable, auditable, MIT-licensed.

### 5. The site is open source. Every fix has a PR.

The repo at [github.com/onlyoasis/entrycardguide](https://github.com/onlyoasis/entrycardguide) is the entire site. Every page on the live site corresponds to a markdown file in `content/`. Every TOML and JSON change corresponds to a commit. Every commit has a message explaining what changed and why.

Found a bug, a stale fact, a missing country, a domain we should remove? **Open a PR or an issue.** We respond within 48 hours and ship within a week, faster if it's safety-critical.

## Step 2: Write the section

Place the new section in `about.md` between "What we are not" and "How we make money".

Length target: **400-600 words in the EN version**. Long enough to land the points; short enough that the pattern feels confident, not defensive.

### Writing guidance

- **Title for the section**: avoid corporate phrases. "Our methodology" is functional; "How we make our claims auditable" is better; "How to fact-check us" is best (it's what readers actually want to do, framed in their language).
- **Format**: numbered list of the five things, with each item being 50-100 words and a clickable artifact.
- **Tone**: the rest of the site is direct and slightly punchy. Match that. No "we believe in transparency" or "our commitment to integrity."
- **Be specific**: name files, commit hashes, line counts. "the 13 domains we removed in commit 6c841f3" is stronger than "we audit our scam list regularly."
- **No marketing**: this section is the most marketing-resistant part of the site. Read it twice, delete any sentence that could appear in any travel blog's about page.

## Step 3: Translate to Chinese

Rewrite, don't auto-translate. The integrity argument lands differently in Chinese:

- Mainland Chinese readers are saturated with "transparency" claims that mean nothing. Be more concrete and less PR.
- The phrase "open source" / "open-source" doesn't have the same charge in Chinese as in English. Use 开源, but back it with concrete artifacts (the GitHub URL, specific file paths) rather than relying on "open source" as a brand signal.
- Chinese readers tend to value "可查证" (verifiable) and "可审计" (auditable) more than abstract trust language.

The structure (5 items, each with an artifact) is the same. Word counts will be ~30% shorter due to character density.

## Step 4 (recommended): Create a `/trust/` page

Optional but high-leverage. The about page is constrained on length; a dedicated `/trust/` page can go deeper.

`content/trust.md`:

```markdown
---
title: "How to verify everything on this site"
kicker: "Five independent verification paths. None require trusting us."
description: "The full methodology behind every claim on entrycardguide.com. Verifiable by anyone, no account needed."
date: 2026-04-26
lastmod: 2026-04-26
url: "/trust/"
---

This is the long version of [the about page methodology section](/about/#methodology).

## Path 1: Verify any government URL

[Detailed walkthrough with screenshots showing how to use the GitHub TOML
files to verify a URL was official as of a given date.]

## Path 2: Verify any field rule

[Detailed walkthrough comparing our JSON spec against the live form,
including how to use Chrome DevTools to inspect input attributes.]

## Path 3: Verify the scam_sites list integrity

[Detailed walkthrough including the dig command we use, the news-search
queries we run monthly, and the DNS audit policy.]

## Path 4: Verify the validator is local

[DevTools walkthrough; show that no network requests fire when typing.]

## Path 5: Verify the entire site

[Walkthrough of cloning the repo, running `hugo server`, and producing
an identical site to what's deployed.]
```

The corresponding ZH version at `content/trust.zh.md`.

This page will be relatively low-traffic but extremely high-credibility for the readers who do find it (often journalists doing source verification, academics studying immigration policy, or competitors trying to figure out our angle).

## Step 5: Add internal links from articles

Add a single inline link from the most-trafficked articles pointing to the methodology section:

- `content/_index.md` — bottom of homepage, before the affiliate footer
- `content/thailand/tdac.md` — under "Before you touch any form"
- `content/thailand/is-ivisa-official.md` — at the end, framed as "if you don't trust us, here's how to check our work"

Same for ZH versions.

Pattern:

```markdown
We make every claim on this site auditable. [How to fact-check us](/about/#methodology) — five independent paths.
```

(Match the i18n version on /zh/ pages.)

## Acceptance criteria

This task is done when:

1. **`/about/` and `/zh/about/` have a new methodology section** with at least 5 numbered items, each with a clickable artifact (link to a file, commit, or external resource).
2. **Each item names a real artifact in the repo** — no vague "our process" claims.
3. **Three articles link to the methodology section** in both EN and ZH.
4. **Optional `/trust/` page exists in EN and ZH** if you took that path.
5. **Local build passes:** `npm run build:prod && npm run check:seo`
6. **Manual readability check:** read the section aloud. If any sentence could appear unchanged on any other travel blog's about page, rewrite it.
7. **Open a PR** with title `feat: surface methodology as the credibility centerpiece on /about/`. CI green.

## Why this matters

Most travel content sites compete on:
- SEO volume (publish more pages)
- Visual polish (better photos, prettier templates)
- Authority signals (expert quotes, bylines)

We can't easily compete on any of those. We can compete on **provability**.

Every other anti-scam guide on the internet asks readers to trust the author. We ask readers to **not trust us — and here are five tools to verify our work.**

That posture is hard to copy. Other sites can't match it without rebuilding their content management on the same kind of public, versioned infrastructure. The methodology section makes the moat visible.

## Out of scope

- Don't add a "verified by X" badge from any third-party trust service. They're paid. We don't pay.
- Don't add testimonials or expert endorsements. They're orthogonal to provability.
- Don't add a "press coverage" section unless we actually get press coverage.
- Don't soften the directness. "Don't trust us, verify our work" is the line. "We strive for transparency" is corporate sludge that means nothing.

When you're done, update this file with your name and the merge date.
