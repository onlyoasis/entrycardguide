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

## How we make money

Two affiliate links at the bottom of each guide:

1. **Travel insurance.** When you click through and buy a policy, we get a small commission from the insurer. The price you pay is the same as going direct.
2. **eSIM data plans.** Same model. You get connectivity on arrival, we get a small cut.

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

## How to verify any claim on this site

We try to make this easy. The patterns:

- **Official URLs:** all listed in `data/official_urls/{country}.toml` in [our GitHub](https://github.com/onlyoasis/entrycardguide). Each entry has a `last_verified` date and (where available) a Wayback Machine archive URL. You can click through to the archived snapshot and confirm the URL was the official one on that date.
- **Scam-site evidence:** each entry in the `scam_sites` table has an `evidence` field describing why we listed it. We only list sites we have personally observed charging fees for the free forms.
- **Field validators:** every validator runs 100% in your browser. The source code is linked from the validator widget itself. You can open DevTools and watch the network tab to confirm we send nothing.

## Errors and corrections

We will get things wrong. Government forms change. New scam sites appear. Old ones quietly become legitimate.

If you spot something incorrect:

1. Open an issue on [our GitHub](https://github.com/onlyoasis/entrycardguide/issues).
2. Or email `corrections@entrycardguide.com` with what you found.

We aim to respond within 48 hours and ship a fix within a week, faster if it's safety-critical.

## Who built this

A small team of travelers and developers. We have all paid a middleman at least once before figuring out we did not have to. This site is our way of saving the next person from the same mistake.

If you find this useful and want to support it, click through one of the affiliate links at the bottom of any guide the next time you book travel. That keeps the site running. That is the entire ask.
