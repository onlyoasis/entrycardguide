---
title: "About"
description: "Who runs entrycardguide, why this site exists, how we make money, and what we promise we will never do."
date: 2026-04-25
lastmod: 2026-04-25
url: "/about/"
---

## Why this site exists

Every country listed on this site has a digital arrival card. Every one of those forms is **free**. Every one of those forms is filed at exactly one official government URL.

And every one of them has a small ecosystem of paid middlemen sitting in front of the official URL in Google's search results, charging $20 to $90 to fill a form that takes 8 minutes.

In March 2026, the Royal Thai Immigration Bureau publicly stated that **about 10% of foreign arrivals to Thailand had paid a non-official site to file their TDAC**. That is the number that started this project.

We could not figure out why no one had built the obvious thing: a free, independent, plain-English guide to each country's official form, with screenshots of the scam sites next to a giant link to the real one. So we built it.

## What we are

- An independent guide to digital arrival cards.
- Written by people who have actually filed each form.
- Updated when the official sites change.
- Hosted as a static site. No accounts, no logins, no databases.
- 100% open source. The code, the field rules, the scam-site list — all in [our GitHub repo](https://github.com/onlyoasis/entrycardguide).

## What we are not

- Not the Royal Thai Immigration Bureau, INM, DGM, or Jabatan Imigresen Malaysia.
- Not a travel agency.
- Not a visa middleman.
- Not affiliated with iVisa, VisaHQ, Sherpa, or any visa processing service.
- Not in the business of filing forms for you. We will not take your passport, your money, or your data.

<a id="methodology"></a>

## How to fact-check us

Do not trust us because the site looks serious. Check the artifacts.

1. **Official URLs live in versioned TOML.** Every government URL we point to is stored in [`data/official_urls/{country}.toml`](https://github.com/onlyoasis/entrycardguide/tree/main/data/official_urls), not buried in a template. The Thailand TDAC record, for example, names `tdac.immigration.go.th`, the Royal Thai Immigration Bureau, a `last_verified` date, and a Wayback Machine snapshot. You can compare the TOML, the archived page, and the site you see today without taking our word for it.

2. **Field rules live in JSON you can inspect.** The validator rules are stored in [`data/rules/{country}.json`](https://github.com/onlyoasis/entrycardguide/tree/main/data/rules). Those files list max lengths, regex patterns, required fields, and error text copied from the official forms. The browser widget reads those specs; it does not invent advice. If a government form changes, the JSON is the thing that has to change.

3. **Scam warnings are tied to DNS and evidence.** Each `[[scam_sites]]` entry in the TOML files has a domain, an observed date, and a short evidence note. We only keep domains that resolve when audited. In commit [`6c841f3`](https://github.com/onlyoasis/entrycardguide/commit/6c841f3), 13 dead domains were removed after a DNS audit. Fewer real warnings are better than a bigger list full of ghosts.

4. **The validator runs in your browser.** Open DevTools, go to Network, type into a validator, and watch what happens: no outbound request is sent with your passport data. The rules are embedded in the page and checked locally by [`assets/js/validator.ts`](https://github.com/onlyoasis/entrycardguide/blob/main/assets/js/validator.ts). We do not log keystrokes, store drafts, or phone home with partial submissions.

5. **The whole site is open source.** The live pages map to Markdown files in [`content/`](https://github.com/onlyoasis/entrycardguide/tree/main/content). Data changes map to commits. Corrections happen in public through [issues](https://github.com/onlyoasis/entrycardguide/issues), pull requests, and the git history. If you want the longer walkthrough, read [how to verify everything on this site](/trust/).

## How we make money

We currently use one affiliate link at the bottom of eligible guides:

1. **Travel insurance through SafetyWing.** When you click through and buy a policy, we get a small commission from SafetyWing. The price you pay is the same as going direct.

We may add eSIM links later, but we will only show them when the partner link is live and clearly disclosed.

That's it. That is the entire business model.

We have **never** taken money from iVisa or any visa middleman. We will not, ever. Not because we are noble, but because doing so would invalidate the entire premise of this site, and we like the premise.

## What we promise

We will never:

- Charge you for any service related to filling an arrival card.
- Collect or store data you type into our validators. Everything runs in your browser.
- Sell or share data with any third party. We do not have data to sell.
- Accept advertising from visa middlemen, immigration consultants, or any service that competes with the official government forms we point to.
- Hide the fact that a country's policy has changed. When the rules change, we update the page and stamp the date at the top.

We will:

- Keep the official URL at the top of every guide.
- Update the field rules when official forms change. Each rules file has a `lastVerified` date you can audit in [our GitHub data folder](https://github.com/onlyoasis/entrycardguide/tree/main/data).
- Add new countries when their digital arrival cards launch and the same scam pattern emerges.
- Take down content the moment we are wrong about something. Email us and we'll fix it the same day.

## Errors and corrections

We will get things wrong. Government forms change. New scam sites appear. Old ones quietly become legitimate.

If you spot something incorrect:

1. Open an issue on [our GitHub](https://github.com/onlyoasis/entrycardguide/issues).
2. Or email `corrections@entrycardguide.com` with what you found.

We aim to respond within 48 hours and ship a fix within a week, faster if it's safety-critical.

## Who built this

A small team of travelers and developers. We have all paid a middleman at least once before figuring out we did not have to. This site is our way of saving the next person from the same mistake.

If you find this useful and want to support it, click through the affiliate link at the bottom of any eligible guide the next time you buy travel insurance. That keeps the site running. That is the entire ask.
