# Task 03 — Capture real screenshots of scam-site cards

**Status:** open
**Estimated time:** 1.5–3 hours
**Difficulty:** ⭐ (mechanical, but requires care around live scam sites)
**Skills needed:** basic shell, image editing optional, browser automation a plus

## What this task is

Every country page on entrycardguide.com has a "scam gallery" section that renders cards for known commercial middleman / scam sites. Right now, when no real screenshot is available, the card shows a paper-colored evidence panel with text from `data/official_urls/{country}.toml`.

This is fine but visually weak. The site's whole point is reactive pattern recognition: "look at this scam site next to a giant red NOT OFFICIAL stamp, and look at the official one next to it." That punch lands much harder with a real screenshot.

This task captures real screenshots of the 9 currently-listed scam sites and wires them into the existing `{{< scam-site >}}` shortcode.

## Scope

There are exactly 9 unique scam domains across the 7 country TOMLs. Capture one 1200×800 PNG each, drop into `static/scams/`, and update each markdown call.

## The 9 domains

Listed by country TOML they appear in. **All 9 currently resolve via DNS.** A few are referenced under multiple countries (iVisa, in particular, is referenced under all 7).

| Country | Domain | TOML location | URL to capture |
|---|---|---|---|
| Thailand | `thailand-tdac.com` | `data/official_urls/thailand.toml` | `https://thailand-tdac.com/` |
| All countries (shared) | `ivisa.com` | every country's TOML | `https://www.ivisa.com/thailand` (and per-country variants — see "Per-country iVisa pages" below) |
| Mexico | `mexico-fmm.com` | `data/official_urls/mexico.toml` | `https://mexico-fmm.com/` |
| Dominican | `eticket-dominican.com` | `data/official_urls/dominican.toml` | `https://eticket-dominican.com/` |
| Malaysia | `malaysia-mdac.com` | `data/official_urls/malaysia.toml` | `https://malaysia-mdac.com/` |
| Vietnam | `vietnam-evisa.org` | `data/official_urls/vietnam.toml` | `https://vietnam-evisa.org/` |
| Vietnam | `evisa-vietnam.com` | `data/official_urls/vietnam.toml` | `https://evisa-vietnam.com/` |
| Vietnam | `vietnam-visa-online.com` | `data/official_urls/vietnam.toml` | `https://vietnam-visa-online.com/` |
| Indonesia | `indonesia-evoa.com` | `data/official_urls/indonesia.toml` | `https://indonesia-evoa.com/` |

**Per-country iVisa pages**: iVisa shows a different landing page per country. Capture each separately so that, e.g., Thailand pages show iVisa's Thailand landing and Mexico pages show iVisa's Mexico landing.

| Country | iVisa URL |
|---|---|
| Thailand | `https://www.ivisa.com/thailand` |
| Mexico | `https://www.ivisa.com/mexico` |
| Dominican Republic | `https://www.ivisa.com/dominican-republic` |
| Malaysia | `https://www.ivisa.com/malaysia` |
| Vietnam | `https://www.ivisa.com/vietnam` |
| Indonesia | `https://www.ivisa.com/indonesia` |
| Singapore | `https://www.ivisa.com/singapore` |

**Total to capture: 9 unique scam-domain landing pages + 7 iVisa per-country variants = 16 screenshots.**

## Safety: capture without visiting in your real browser

These are commercial sites that sometimes deliver malware, drive-by downloads, or aggressive tracking. **Do not load them in your daily browser.** Use one of these:

### Option A: Wayback Machine (safest, recommended)

The Internet Archive has cached versions of most of these sites. Wayback renders archived HTML in a sandboxed iframe.

```bash
# Find the latest snapshot for a domain
curl -sIL "https://web.archive.org/web/2026/{TARGET_URL}" | grep -i location

# Or just navigate to:
# https://web.archive.org/web/{TARGET_URL}
```

If a domain has a recent snapshot, load that in your browser, take a screenshot via your OS (`Cmd-Shift-4` on macOS, `Win+Shift+S` on Windows). Crop to 1200×800, save as PNG.

### Option B: Headless screenshot service (fastest)

Services like `https://image.thum.io` or `https://api.urlbox.io` render pages server-side and return a PNG. Free tiers cover this volume easily.

```bash
# image.thum.io free tier (no auth needed)
URL="https://thailand-tdac.com/"
curl -L --max-time 60 \
  "https://image.thum.io/get/width/1200/crop/800/png/${URL}" \
  -o "static/scams/thailand-tdac.png"
```

If `image.thum.io` 502s or times out (it occasionally does), retry. If the service blocks the target site (some scam sites refuse `Mozilla/5.0` user agents), fall back to Option C.

### Option C: Local headless Chromium with Playwright

Most reliable for sites that detect / block automated capture services. Requires installing Playwright.

```bash
# install
npm i -D playwright
npx playwright install chromium

# capture
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  });
  const page = await ctx.newPage();
  await page.goto('https://thailand-tdac.com/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: 'static/scams/thailand-tdac.png', fullPage: false });
  await browser.close();
})();
"
```

Some sites detect Playwright via `navigator.webdriver`. If you hit that, add `playwright-extra` with the stealth plugin.

## File naming convention

Save screenshots into `static/scams/` with the domain as the filename (replace dots with hyphens):

| Domain | Filename |
|---|---|
| `thailand-tdac.com` | `static/scams/thailand-tdac-com.png` |
| `mexico-fmm.com` | `static/scams/mexico-fmm-com.png` |
| `eticket-dominican.com` | `static/scams/eticket-dominican-com.png` |
| `malaysia-mdac.com` | `static/scams/malaysia-mdac-com.png` |
| `vietnam-evisa.org` | `static/scams/vietnam-evisa-org.png` |
| `evisa-vietnam.com` | `static/scams/evisa-vietnam-com.png` |
| `vietnam-visa-online.com` | `static/scams/vietnam-visa-online-com.png` |
| `indonesia-evoa.com` | `static/scams/indonesia-evoa-com.png` |
| iVisa Thailand | `static/scams/ivisa-com-thailand.png` |
| iVisa Mexico | `static/scams/ivisa-com-mexico.png` |
| iVisa DR | `static/scams/ivisa-com-dominican.png` |
| iVisa Malaysia | `static/scams/ivisa-com-malaysia.png` |
| iVisa Vietnam | `static/scams/ivisa-com-vietnam.png` |
| iVisa Indonesia | `static/scams/ivisa-com-indonesia.png` |
| iVisa Singapore | `static/scams/ivisa-com-singapore.png` |

## File specs

- **Format:** PNG (lossless; the site is text-heavy and JPEG artifacts look bad on text)
- **Dimensions:** 1200 × 800 px (matches the scam-card aspect ratio)
- **Size budget:** target ≤ 200 KB per image. The card displays at ~600 px wide, so 1200 px is 2× retina. PNG compression handles this well; if a particular file exceeds 300 KB, run it through `pngquant`:
  ```bash
  brew install pngquant  # if not installed
  pngquant --quality=70-90 --skip-if-larger --output static/scams/file.png --force static/scams/file.png
  ```

## Wire screenshots into markdown

The `{{< scam-site >}}` shortcode already supports a `screenshot=` parameter. Update each call site to pass it:

**Before:**
```hugo
{{< scam-site country="thailand" domain="thailand-tdac.com" >}}
```

**After:**
```hugo
{{< scam-site country="thailand" domain="thailand-tdac.com" screenshot="/scams/thailand-tdac-com.png" >}}
```

Files to update (16 markdown files; each has the gallery section near the bottom):

```
content/thailand/tdac.md
content/thailand/tdac.zh.md
content/thailand/is-ivisa-official.md
content/mexico/fmm.md
content/mexico/fmm.zh.md
content/mexico/is-ivisa-official.md
content/dominican/eticket.md
content/dominican/eticket.zh.md
content/dominican/is-ivisa-official.md
content/malaysia/mdac.md
content/malaysia/mdac.zh.md
content/malaysia/is-ivisa-official.md
content/vietnam/evisa.md
content/vietnam/evisa.zh.md
content/indonesia/e-cd.md
content/indonesia/e-cd.zh.md
content/singapore/sgac.md
content/singapore/sgac.zh.md
```

(The 3 country pages for V / I / S that don't yet have an `is-ivisa-official.md` will be created in a separate task. Don't worry about them.)

## Acceptance criteria

This task is done when:

1. **All 16 PNG files exist** in `static/scams/` with the names listed above.
2. **Every PNG is ≤ 300 KB and 1200×800 px** (use `file static/scams/*.png` to verify dimensions; use `du -ah static/scams/` to check size).
3. **Every `{{< scam-site >}}` shortcode call across the 18 listed markdown files has the `screenshot=` parameter wired up.**
4. **Local build passes:**
   ```bash
   npm run build:prod && npm run check:seo
   ```
5. **Visual spot-check:** `npm run dev`, open `http://localhost:1313/thailand/tdac/`, scroll to the scam gallery, see real screenshots with the red NOT OFFICIAL stamp on top.
6. **Open a PR** with title `feat: add real screenshots to scam-site cards`. CI must be green.

## Why we care

Right now: the cards show a paper-colored "Evidence" panel with text. Functional but flat.

After your work: the cards show real screenshots of `thailand-tdac.com` (paid signup page, payment fields, etc.) with a giant red NOT OFFICIAL stamp on top. Then directly underneath, the official site `tdac.immigration.go.th` callout: "free, .go.th, no payment."

That side-by-side is the most visceral anti-scam moment on the entire site. Worth the 2 hours.

## Edge cases & gotchas

- **iVisa.com** is a sophisticated React SPA. A naive screenshot may capture only the loading state. Use Option C (Playwright with `waitUntil: 'networkidle'` and a small extra `await page.waitForTimeout(2000)` before screenshotting).
- **Some scam sites geofence**. `vietnam-evisa.org` and `evisa-vietnam.com` have been observed serving different content based on IP origin (a US/EU IP sees the English scam page; an Asian IP sometimes sees a different version). If you get a blank or unexpected page, try a US-based VPN or use a US-based screenshot service.
- **Dead pages**: if a site goes down between the time we audited DNS and the time you capture, fall back to Wayback Machine (Option A). Make a note in `data/official_urls/{country}.toml` updating the `last_verified` date and adding a comment about the dead state.
- **Don't fake it**: if you can't capture a real screenshot for a particular domain, leave the existing evidence-card placeholder in place (don't pass `screenshot=`). Better to ship 12 real screenshots and 4 evidence cards than 16 made-up images.

## Out of scope (do not do)

- Don't pay any of these sites to test them. We do not need a "real" filing experience to capture a landing-page screenshot.
- Don't add new domains to the scam_sites lists. That's a separate task with stricter verification requirements.
- Don't redesign the card layout. The existing CSS handles the screenshot + stamp + caption.

## Reference

- Existing `{{< scam-site >}}` implementation: `layouts/shortcodes/scam-site.html`
- Card CSS: search for `.scam-card`, `.scam-stamp`, `.scam-domain` in `assets/css/main.css`
- Working example with screenshot already wired: none yet — yours will be the first. Use the existing `screenshot=""` default in the shortcode source as your guide.

When you're done, update this file with your name and the merge date so the next person knows it's complete.
