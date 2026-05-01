---
title: "Which arrival forms do I need? — 60-second decision tool"
kicker: "Pick your destination, answer 1-2 questions, get the exact list of free and paid government forms you need to file. Covers Thailand, Mexico, Dominican Republic, Malaysia, Vietnam, Indonesia, Singapore."
description: "Free interactive tool to find out which digital arrival cards, customs declarations, and e-visas you actually need across 7 countries. 100% browser-side. No login. Government URLs only."
date: 2026-04-28
lastmod: 2026-04-28
url: "/decide/"
keywords: ["which arrival forms do I need", "do I need TDAC", "do I need FMM mexico", "do I need MDAC", "vietnam evisa or visa free", "indonesia evoa or evoa", "singapore SGAC needed", "asia entry forms quiz"]
---

{{< decide >}}

## Who this tool is for

Ever Googled *"do I need an FMM if I'm flying to Cancun"* or *"is the SGAC required for Singapore citizens"* and gotten contradictory answers from five different travel blogs?

That's the gap this tool closes.

We built it because the rules change by country, by entry mode, and by your nationality, and **no other site lays out all three dimensions in one place**. Every other guide tells you what *they* needed for *their* trip, not what *you* need for *yours*.

## How it works

1. Pick your destination
2. Answer at most 2 follow-up questions
3. Get a card listing each form you need, the official URL, the government fee (if any), and a link to our field-by-field guide

That's it. No email signup. No PDF download with our branding. The answer just appears.

## What we cover

- 🇹🇭 **Thailand** — TDAC (free)
- 🇲🇽 **Mexico** — FMM-E (free, but only sometimes needed since the 2023 stamp transition)
- 🇩🇴 **Dominican Republic** — E-Ticket (free)
- 🇲🇾 **Malaysia** — MDAC (free, with multiple exemption categories)
- 🇻🇳 **Vietnam** — E-Visa ($25 USD government fee) or visa-free entry depending on nationality
- 🇮🇩 **Indonesia** — e-CD (always free) plus e-VOA ($35 USD) if you need a visa
- 🇸🇬 **Singapore** — SGAC (free, with exemptions)

## What we don't cover (yet)

- US ESTA, EU ETIAS, UK ETA, Canada eTA — different model (visa-waiver authorizations rather than arrival cards). Coverage candidates for v2.
- Chinese visa rules — too complex for a quiz format; needs full guides.
- Cambodia, Laos, Myanmar, Sri Lanka — all candidates for adding once they finalize their digital arrival systems.

If you'd like a country added, [open an issue on GitHub](https://github.com/onlyoasis/entrycardguide/issues).

## How we keep this accurate

The decision tree is stored as a single [JSON file in our repo](https://github.com/onlyoasis/entrycardguide/blob/main/data/decision/tree.json). Every answer state cites the official government URL we recommend. Every URL has a `last_verified` date in the country's TOML data file.

When a country changes its rules — fees, eligibility, exemption categories — we update the JSON. The change is visible in the git history with the date and reason. You can audit every claim this tool makes against the live government site, in under a minute.
