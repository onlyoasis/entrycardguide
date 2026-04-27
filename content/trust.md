---
title: "How to verify everything on this site"
kicker: "Five independent verification paths. None require trusting us."
description: "The full methodology behind every claim on entrycardguide.com. Verifiable by anyone, no account needed."
date: 2026-04-27
lastmod: 2026-04-27
url: "/trust/"
---

This is the long version of [the about page methodology section](/about/#methodology). The short version: do not trust the writing. Check the files.

## Path 1: Verify any government URL

Every official URL lives in [`data/official_urls/`](https://github.com/onlyoasis/entrycardguide/tree/main/data/official_urls). Open a country file, for example [`data/official_urls/thailand.toml`](https://github.com/onlyoasis/entrycardguide/blob/main/data/official_urls/thailand.toml), and look at the record for the form.

Each record names the URL, the agency, the date we last checked it, and usually an archived snapshot. For Thailand TDAC, that means `tdac.immigration.go.th`, the Royal Thai Immigration Bureau, and a `.go.th` note explaining why the suffix matters.

You can verify the claim three ways:

1. Compare the URL in the TOML file with the link shown on the page.
2. Open the `archive_url` and confirm the official site existed at that date.
3. Open the current live government site and compare the domain suffix.

If those three disagree, the site should be fixed.

## Path 2: Verify any field rule

The validators are driven by JSON specs in [`data/rules/`](https://github.com/onlyoasis/entrycardguide/tree/main/data/rules), not by hidden server logic. Open [`data/rules/thailand.json`](https://github.com/onlyoasis/entrycardguide/blob/main/data/rules/thailand.json) and you will see fields, required flags, patterns, max lengths, and error messages.

To check one rule yourself, open the official form in Chrome, inspect the field, and compare its HTML attributes with the JSON. Look for `maxlength`, `pattern`, `required`, input type, and the error text the official site returns.

When the official site changes, this is the file that should drift. That is why each rules file has a verification date and why the validator links back to its source.

## Path 3: Verify the scam-site list

Scam warnings are stored in the `[[scam_sites]]` arrays inside the same TOML files as the official URLs. Each entry has a domain, the first date we observed it, and an evidence note.

The policy is simple: a domain must resolve via DNS when we list it. It also needs evidence that it charges for a free form, imitates an official flow, or appears in a public warning or news report. If a domain stops resolving, we remove it instead of keeping a stale warning.

That happened in commit [`6c841f3`](https://github.com/onlyoasis/entrycardguide/commit/6c841f3), which removed 13 dead domains after a DNS audit. A shorter list with live domains is more useful than a dramatic list no traveler can verify.

To repeat the check, run `dig example.com` or `nslookup example.com`, then compare the result with the evidence in the TOML.

## Path 4: Verify the validator is local

Open a guide with a validator, then open DevTools and switch to the Network tab. Type sample data into the validator. No request should leave the page with the values you typed.

The validator is implemented in [`assets/js/validator.ts`](https://github.com/onlyoasis/entrycardguide/blob/main/assets/js/validator.ts). The page embeds the country rules as JSON, the script parses them in your browser, and validation happens locally.

There is no account system, no database, and no endpoint that receives draft form data. If a future change adds one, it should be visible in the source and in the network panel.

## Path 5: Verify the whole site

The repository at [`github.com/onlyoasis/entrycardguide`](https://github.com/onlyoasis/entrycardguide) is the site. Markdown pages live in [`content/`](https://github.com/onlyoasis/entrycardguide/tree/main/content), structured data lives in [`data/`](https://github.com/onlyoasis/entrycardguide/tree/main/data), templates live in [`layouts/`](https://github.com/onlyoasis/entrycardguide/tree/main/layouts), and browser code lives in [`assets/js/`](https://github.com/onlyoasis/entrycardguide/tree/main/assets/js).

To reproduce the site locally:

```powershell
git clone https://github.com/onlyoasis/entrycardguide.git
cd entrycardguide
npm ci
hugo server --gc --disableFastRender
```

The local site should match the deployed site except for the deploy commit shown in the footer. If you find a stale fact, a broken official URL, or a scam warning that no longer resolves, open an [issue](https://github.com/onlyoasis/entrycardguide/issues) or a pull request with the exact artifact that failed.
