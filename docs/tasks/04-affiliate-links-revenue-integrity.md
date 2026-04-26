# Task 04 — Wire up real affiliate links (close the credibility gap)

**Status:** open
**Estimated time:** 2–4 hours (most of which is filling out partner application forms)
**Difficulty:** ⭐⭐ (no hard tech; the gating step is approval timelines from affiliate networks)
**Skills needed:** basic Hugo template editing, ability to fill affiliate sign-up forms

## What this task is

Every article on entrycardguide.com claims "our only revenue is from travel insurance and eSIM affiliate links at the bottom of this page."

**Those links don't exist yet.**

This is the single most credibility-damaging gap on the site right now. The integrity argument that drives every other word ("we have no incentive to push you anywhere except the official site") is undermined the moment a careful reader scrolls down and finds zero monetization. Either we add the links, or we delete the claim. The right move is to add them, since affiliate revenue is genuinely how this site is supposed to sustain.

## What you'll deliver

By the end of this task:

1. **Approved affiliate accounts** with at least one travel insurance partner and at least one eSIM partner.
2. **A new Hugo partial** `layouts/partials/affiliate-footer.html` that renders the links at the bottom of every article.
3. **Updated content** — at least one inline reference per country page that contextualizes the affiliate offer (e.g. "Most travelers we point at the official TDAC also need a 5-day eSIM. We use [Airalo's Thailand plan]").
4. **A clear FTC-compliant disclosure** on every page where an affiliate link appears.
5. **Updated `about.md`** to reflect actually having the affiliates wired (not just promising them).

## Recommended affiliate partners

These are the partners that align with the site's anti-scam positioning. They have low-friction sign-ups, generous cookie windows, and a real product that helps travelers.

### Travel insurance — pick one (or both)

| Partner | Commission | Cookie | Notes |
|---|---|---|---|
| **SafetyWing** | 10% recurring on Nomad Insurance subscriptions | 60 days | Backpacker / nomad-friendly. Strong fit for our "going to Thailand on a budget" reader. Sign up at [safetywing.com/affiliate](https://safetywing.com/affiliate). |
| **World Nomads** | $20 USD per policy | 90 days | More mainstream. Better fit for shorter trips and family travel. Sign up at [worldnomads.com/travel-insurance/become-an-affiliate](https://www.worldnomads.com/travel-insurance/become-an-affiliate). |
| **Heymondo** | 10% per policy | 60 days | Spanish-based, but covers all travelers. Useful for Mexico/DR pages. Sign up via their affiliate page. |
| **InsureMyTrip** | $10–30 per quote | 30 days | Aggregator. Pays per **quote**, not per purchase, which often converts better. |

**Recommendation:** apply to **SafetyWing first** (fastest approval, best for our audience). Add World Nomads as a fallback if SafetyWing rejects.

### eSIM — pick one

| Partner | Commission | Cookie | Notes |
|---|---|---|---|
| **Airalo** | 10% per package | 30 days | Most countries covered, including all 7 we have pages for. Sign up at [partners.airalo.com](https://partners.airalo.com/). |
| **Holafly** | 5% per package | 60 days | Unlimited data plans. Slightly more premium pricing. |
| **Saily** | 8% per package | 30 days | Backed by NordVPN. Fastest activation. |

**Recommendation:** **Airalo**. Best country coverage, cleanest UX, longest-running program. Approval typically takes 2–5 business days.

### Optional: hotels (later, low priority)

Booking.com and Hotels.com both have affiliate programs, but the integration overhead is real and the conversion rates from a content site like ours are modest. **Skip for v1.5.** If you want to revisit, start with [Booking.com Affiliate Partner Programme](https://www.booking.com/affiliate-program/v2/index.html).

## Implementation

### Step 1: Apply for the partner accounts (do this first; approvals run async)

Apply to:
- SafetyWing affiliate program
- Airalo Partners

For both, use:
- Site: `https://entrycardguide.com`
- Audience: international travelers searching for digital arrival cards
- Monthly traffic: state your honest current number (low is fine; they care about content quality and audience fit)
- Promotion methods: in-content links and footer placement

While waiting for approvals, do everything else. When approved, drop the partner IDs into the env vars described below.

### Step 2: Add affiliate IDs to site config (or env vars)

Add to `config.toml` under `[params]`:

```toml
[params.affiliate]
  safetywing_id = "YOUR_SAFETYWING_ID"
  airalo_id = "YOUR_AIRALO_ID"
  worldnomads_id = ""  # empty if not using
```

**For sensitive IDs that you don't want in git:** use Hugo's environment variables instead:

```bash
# Required by config.toml's [security.funcs] getenv allowlist:
HUGO_PARAMS_AFFILIATE_SAFETYWING_ID=xxx
HUGO_PARAMS_AFFILIATE_AIRALO_ID=xxx
```

Update `config.toml`'s `[security.funcs]` block to allow these:

```toml
[security]
  [security.funcs]
    getenv = ["^HUGO_", "^CI$", "^GITHUB_"]  # already allows HUGO_*
```

(Already covered. Good.)

For Cloudflare Pages: add these as env vars in the Pages dashboard → Settings → Environment Variables. Both "Production" and "Preview" environments. The deploy workflow will pick them up automatically.

### Step 3: Create the affiliate-footer partial

`layouts/partials/affiliate-footer.html`:

```html
{{- /*
  Renders the per-article affiliate footer.
  Only emits links when affiliate IDs are configured (graceful degradation).
  FTC compliance: every link is preceded by a clear disclosure.
*/ -}}
{{- $sw := .Site.Params.affiliate.safetywing_id }}
{{- $ai := .Site.Params.affiliate.airalo_id }}
{{- if or $sw $ai }}
<aside class="border-t-2 border-ink mt-xl pt-md" aria-labelledby="affiliate-heading">
  <h3 id="affiliate-heading" class="font-mono text-meta uppercase text-muted mb-3 font-medium">
    {{ i18n "affiliate_heading" }}
  </h3>
  <p class="text-small text-muted mb-4">{{ i18n "affiliate_disclosure" }}</p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {{- with $sw }}
    <a href="https://safetywing.com/?referenceID={{ . }}" rel="sponsored noopener" class="block border border-rule p-md no-underline hover:bg-rule">
      <div class="text-meta font-mono uppercase text-muted mb-2">{{ i18n "affiliate_insurance_label" }}</div>
      <div class="text-h3 text-ink font-medium">{{ i18n "affiliate_safetywing_title" }}</div>
      <div class="text-small text-muted mt-2">{{ i18n "affiliate_safetywing_desc" }}</div>
    </a>
    {{- end }}
    {{- with $ai }}
    <a href="https://airalo.tp.st/{{ . }}" rel="sponsored noopener" class="block border border-rule p-md no-underline hover:bg-rule">
      <div class="text-meta font-mono uppercase text-muted mb-2">{{ i18n "affiliate_esim_label" }}</div>
      <div class="text-h3 text-ink font-medium">{{ i18n "affiliate_airalo_title" }}</div>
      <div class="text-small text-muted mt-2">{{ i18n "affiliate_airalo_desc" }}</div>
    </a>
    {{- end }}
  </div>
</aside>
{{- end }}
```

### Step 4: Wire the partial into the article template

Edit `layouts/_default/single.html`. Find the closing of the article body and insert:

```html
{{- partial "affiliate-footer.html" . -}}
```

Place it *before* the article-rail closes / before the closing `</article>` tag, depending on layout. Verify visually.

### Step 5: Add i18n strings

`i18n/en.yaml`:

```yaml
# Affiliate footer
affiliate_heading: "Tools we use"
affiliate_disclosure: "We earn a small commission if you buy through these links. Your price is the same as going direct. We will never recommend a product we don't actually use."
affiliate_insurance_label: "Travel Insurance"
affiliate_esim_label: "eSIM Data"
affiliate_safetywing_title: "SafetyWing Nomad Insurance"
affiliate_safetywing_desc: "Monthly subscription, cancel anytime. Covers all 7 countries on this site."
affiliate_airalo_title: "Airalo eSIM"
affiliate_airalo_desc: "5-30 day data plans. Activates by QR code. We use this on every trip."
```

`i18n/zh.yaml`:

```yaml
# 联盟链接尾部
affiliate_heading: "我们用的工具"
affiliate_disclosure: "通过这些链接购买，我们会拿一笔小额佣金。你支付的价格与直接购买完全一致。我们从不推荐自己不用的产品。"
affiliate_insurance_label: "旅行保险"
affiliate_esim_label: "eSIM 数据"
affiliate_safetywing_title: "SafetyWing 游民保险"
affiliate_safetywing_desc: "月度订阅，随时取消。覆盖本站全部 7 个国家。"
affiliate_airalo_title: "Airalo eSIM"
affiliate_airalo_desc: "5-30 天数据套餐。扫码激活。我们每次旅行都用。"
```

### Step 6: Update the article-rail to point to the affiliates

Currently `layouts/partials/article-rail.html` says "We make money from: travel insurance, eSIM, and tour affiliate links at the bottom of this article." That stays — it now matches reality.

But also add a stronger one-line reference to the affiliate-footer:

```html
<div class="mt-3 pt-3 border-t border-rule text-small">
  <a href="#affiliate-heading" class="text-ink no-underline">{{ i18n "rail_see_tools" }} ↓</a>
</div>
```

Add `rail_see_tools` to both i18n files (`See the tools we use` / `查看我们用的工具`).

### Step 7: Update about.md

Find the "How we make money" section in `content/about.md` and `content/about.zh.md`. Currently it says:

> Two affiliate links at the bottom of each guide:
> 1. **Travel insurance.** When you click through and buy a policy, we get a small commission...
> 2. **eSIM data plans.** Same model.

Tighten to name the actual partners:

```markdown
## How we make money

Two affiliate partners, both visible at the bottom of every guide:

1. **SafetyWing Nomad Insurance** — commission per signup, recurring on monthly subscriptions. We chose SafetyWing because it covers every country on this site, has a flat monthly model travelers actually use, and lets you cancel anytime.

2. **Airalo eSIM** — commission per package purchase. We chose Airalo because they cover all 7 countries (including local plans for Bali specifically, not just "Indonesia"), the QR activation is faster than buying a SIM at the airport, and the rates beat carrier roaming for any trip ≥ 3 days.

**That's it. That is the entire business model.**

We do not take money from iVisa or any visa middleman. We do not run display ads. We do not sell email addresses (we don't even collect them). When the affiliate links break or stop converting, we will replace them with comparable products and update this page. We will never replace them with a worse product just because the commission is higher.
```

Same edit in `about.zh.md` with translations.

### Step 8: FTC + GDPR compliance

This is small but mandatory:

**FTC (US Federal Trade Commission):** any "material connection" between you and a brand must be disclosed. The `affiliate_disclosure` string in step 5 covers this. The disclosure must appear **before or at** the affiliate link, not in a buried about page.

**GDPR / EU users:** the `rel="sponsored noopener"` attribute is required for SEO honesty (Google reads this); the disclosure text covers consent. Cloudflare Pages doesn't drop tracking cookies by default. If you ever add a Cloudflare Web Analytics injector or other JS-based tracker that reads cookies, you'll need a cookie banner. **As of v1.5, no banner is needed.** Don't add one prematurely; cookie banners hurt UX.

**Affiliate network terms:** SafetyWing and Airalo both require:
- Disclosure (covered)
- `rel="sponsored"` link attribute (covered)
- No misleading "official" or "endorsed" claims (we're explicit they're our recommendations, not endorsements)

## Acceptance criteria

This task is done when:

1. **At least 1 travel insurance affiliate is approved** and the ID is set as either a config value or a Cloudflare env var.
2. **At least 1 eSIM affiliate is approved** and the ID is set similarly.
3. **The affiliate-footer partial renders on every article page** (visit `/thailand/tdac/`, scroll to bottom, see the two cards).
4. **The disclosure text appears before the affiliate cards** with the exact `rel="sponsored noopener"` attributes on the links.
5. **Local build passes:** `npm run build:prod && npm run check:seo`
6. **Live click-through works:** click the SafetyWing link in production, verify you land on safetywing.com with `?referenceID=YOUR_ID` in the URL.
7. **`about.md` and `about.zh.md` reflect the actual partners by name** (no more vague "travel insurance affiliate links").
8. **Open a PR** with title `feat: wire up affiliate footer for revenue integrity`. CI green.

## Why this is high priority

The site has a strong integrity narrative: "we have no incentive to push you anywhere except the official site." That narrative dies the moment someone notices the promised affiliate footer doesn't exist.

Two outcomes:
- **Best case:** the reader notices nothing, the integrity story holds, but we leave revenue on the table.
- **Worst case:** the reader notices, decides the whole site is performative, and stops trusting our claims about which government domain is real.

The fix is 4 hours of work (most of it waiting for affiliate approvals). The site moves from "we say we monetize" to "we monetize and the wiring is visible." That changes the credibility profile from neutral to provably honest.

## Out of scope (do not do)

- Don't add display ads (Google AdSense, etc.). They contradict the visual minimalism and hurt page speed.
- Don't add 5+ affiliate partners. Two is plenty; more dilutes per-partner conversion and looks spammy.
- Don't add affiliate links inside the article body in places where they don't make sense. The footer is the right place. Inline mentions are fine but only when contextually motivated (e.g. "after you file the TDAC, you'll want connectivity at the airport — see Airalo at the bottom").
- Don't add interstitial popups, exit-intent modals, or "wait, before you go!" overlays. The site's minimalism is a competitive advantage. Don't burn it.

When you're done, update this file with your name and the merge date.
