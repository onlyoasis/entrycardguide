# Task 05 — Submit site to Bing Webmaster Tools

**Status:** open
**Estimated time:** 10 minutes
**Difficulty:** ⭐ (mostly clicking through dashboard)
**Skills needed:** access to a Microsoft account, ability to log into the site owner's accounts

## What this task is

The site is already verified and submitted to Google Search Console. Bing's index is roughly 5-10% of US search market share, but it also powers DuckDuckGo, Yahoo, and several smaller engines, and it indexes some long-tail travel queries that Google deliberately suppresses. **It's free traffic we're not capturing.**

This task gets entrycardguide.com indexed by Bing.

## Prerequisites

You need:
- Access to the Microsoft account that should own the Bing Webmaster Tools (BWT) property. If the site owner doesn't have one, they need to create one first at [account.microsoft.com](https://account.microsoft.com).
- The Cloudflare DNS API token (for adding a verification TXT record), OR access to the Cloudflare dashboard to add it manually.
- Google Search Console access on the same domain (Bing offers a one-click import that skips most of the setup).

## Recommended path: Import from Google Search Console

This is the fastest route. **Total time: 3 minutes if everything works.**

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters/) and sign in with the Microsoft account.
2. Click **Add a site** → choose **Import from Google Search Console**.
3. Authorize Bing to read your GSC account (one-time OAuth screen). Grant the read-only permission it asks for.
4. Bing fetches the list of GSC properties. Find `entrycardguide.com` in the list, check it.
5. Click **Import**. Bing copies:
   - Property ownership verification (no DNS record needed; ownership is inherited via the GSC OAuth)
   - All submitted sitemaps
   - Existing crawl preferences

That's it. Skip to **Verification** below.

## Manual fallback: if GSC import fails

If the GSC OAuth flow fails (rare but happens with restrictive Google accounts), do it manually.

1. In BWT: **Add a site** → enter `https://entrycardguide.com` → **Add**.
2. BWT shows three verification methods. Pick **DNS** (don't pick the HTML file or meta tag methods — they require code changes; DNS is faster).
3. Bing gives you a TXT record value. It looks like `b1234567890abcdef...` (no `=` prefix).
4. Add the TXT record to Cloudflare:

   ```bash
   # If you have the Cloudflare API token from prior tasks
   export CF_TOKEN="your_token_here"
   ZONE="5001146efbe2cbd3edb562147bfcd472"  # entrycardguide.com zone
   curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE}/dns_records" \
     -H "Authorization: Bearer $CF_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"type":"TXT","name":"@","content":"PASTE_BING_VERIFICATION_VALUE_HERE","ttl":1,"proxied":false,"comment":"Bing Webmaster Tools verification"}'
   ```

   Or via the Cloudflare dashboard:
   - DNS → Records → **Add record**
   - Type: `TXT`
   - Name: `@`
   - Content: paste the Bing value
   - Proxy: **off** (gray cloud)
   - **Save**

5. Wait 30-60 seconds for DNS propagation. Verify with:
   ```bash
   dig TXT entrycardguide.com +short
   ```
   You should see your existing TXT records plus the Bing one.

6. Back in BWT, click **Verify**. It should pass within ~30 seconds.

## Submit the sitemaps

Whether you used the GSC import or the manual path:

1. In BWT, with `entrycardguide.com` selected, go to **Sitemaps** in the left nav.
2. If GSC import picked them up automatically, you'll see `sitemap.xml` and `zh/sitemap.xml` listed already. Skip to verification.
3. If manual: click **Submit sitemap** and enter:
   - `https://entrycardguide.com/sitemap.xml`
   - Then again for `https://entrycardguide.com/zh/sitemap.xml`

## Configure crawl preferences (optional but quick)

In BWT → **Site Settings**:

- **Country/region targeting:** leave as default ("worldwide"). The site is multi-country by design.
- **Crawl rate:** default is fine. Don't slow it down.
- **Block URLs:** leave empty. We want everything indexed.

## Verification

This task is done when:

1. **`entrycardguide.com` shows as Verified in BWT** (green check next to the property name).
2. **Both sitemaps show as Submitted** with discovered-URL counts > 0 (BWT may take a few hours to actually fetch them).
3. **Bing's "Site Explorer" shows at least one of your URLs**. Check by searching `site:entrycardguide.com` directly on bing.com — if any URL appears, indexing has started. (This may take 1-3 weeks; not blocking for task completion.)

## Why this matters less than GSC, but still matters

Bing's market share isn't huge in the US, but:

- **DuckDuckGo** uses Bing's index. Privacy-aware users often default to DuckDuckGo. Travelers researching scams are exactly that audience.
- **Yahoo** (still has measurable share among older US travelers, also uses Bing).
- **ChatGPT's Bing-powered web search** uses Bing's index. This is a growing channel: people ask ChatGPT "is iVisa official for Thailand" and ChatGPT now actually retrieves a Bing result.
- **Apple Safari (in some configurations)** falls back to Bing when Google rate-limits.

Combined: maybe 10-15% of total search-driven traffic. For 10 minutes of work, the ROI is fine.

## What to watch for after submission

Over the first 4 weeks, monitor in BWT under **Performance**:
- Impressions (you're showing up in Bing search results)
- Clicks (people are clicking through)
- Top queries (are they the same as the GSC top queries, or different?)

Bing tends to surface different long-tail queries than Google. Sometimes you'll find a high-performing query in Bing that Google buries — those are content opportunities.

## Acceptance criteria

This task is done when:

1. `entrycardguide.com` is verified in BWT.
2. Both sitemaps are submitted.
3. The verification method (TXT record or GSC import) is documented in this file under "Notes" below.

## Notes

(Person who completes this task: fill in below.)

- Verification method used:
- Date submitted:
- Initial sitemap status (Bing reported X of Y URLs discovered):
- Any issues encountered:

When you're done, update this file with your name and the merge date.
