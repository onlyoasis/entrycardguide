# Quora 推广执行清单

替代 Reddit 的问答型 outreach。Quora 对新账号宽松,排序看答案质量,你站点的"开源数据可核查"在这里是天然加分项。

## 使用规则(必读)

1. **节奏**:一天最多回 2-3 条,跨问题间隔 2-3 小时。一次性灌满会被反作弊降权。
2. **披露**:每条答案必须以 maintainer 披露开头(已写在草稿里)。Quora 反 astroturfing,但**坦诚披露的作者答案被允许**且会被算法奖励。
3. **链接克制**:每条答案最多 2 个外链。第 1 个永远是**官方政府 URL**,第 2 个是 entrycardguide 对应页。顺序绝对不能反。
4. **不要批量复制粘贴**:每条草稿都已针对原题语境单独写。改动越多越好(改一两个词就行)——Quora 全站算法会检测同一段文本在多 URL 出现。
5. **回评论**:发出后 24-48 小时回复任何评论(哪怕是吐槽),Quora 把这视为高质量信号。
6. **不要 follow 你自己**或喊朋友 upvote——Quora 反作弊比 Reddit 还狠。

## 注册时的小动作

- 用真实姓名或可信笔名(不要用 entrycardguide 当用户名,过于明显)
- Bio 写一句:`Maintainer of entrycardguide.com — open-source guide to free government arrival cards.`(让披露天然来自档案而非每条答案)
- 关注 Travel、Thailand、Singapore、Malaysia、Visa 几个 topic,养几天再答

---

## 目标问题 1:What is the official website for Thailand TDAC arrival forms?

**URL:** https://www.quora.com/What-is-the-official-website-for-Thailand-TDAC-arrival-forms

**为什么选**:意图最纯粹——提问者就是在搜"哪个是官方的"。回答价值最高,转化也最好。

**答案草稿:**

```
Disclosure up front: I help maintain entrycardguide.com, an open-source guide to free government arrival cards. I'm biased, but the answer here is verifiable in 30 seconds against the Royal Thai Immigration Bureau itself.

The official Thailand Digital Arrival Card (TDAC) is at:

https://tdac.immigration.go.th

Two things make this URL trustworthy:

1. The .go.th suffix is reserved — only Thai government entities can register it. No commercial site can pretend to be a .go.th.
2. It's the URL the Royal Thai Immigration Bureau itself directs travelers to in their public statements.

The TDAC is free. It takes about 8 minutes. You can submit it any time within 3 days before arrival. There is no expedited or premium version, no matter what other sites claim.

If a site asks you for $20–$90 to "process" the TDAC, it's a reseller, not the government. In late March 2026, Immigration Bureau spokesman Pol Maj Gen Choengron Rimpadee stated that at least 10% of foreign arrivals had used unofficial sites and overpaid (widely reported by Bangkok Post, Khaosod English, and Thai Examiner).

For a field-by-field walkthrough that runs entirely in your browser (no data stored), there's a free guide here: https://entrycardguide.com/thailand/tdac/ — it lists the official URL at the top and names known scam domains with evidence at the bottom. The underlying data is in a public GitHub repo so you can audit any claim.
```

---

## 目标问题 2:How can I avoid Thailand TDAC arrival card scams?

**URL:** https://www.quora.com/How-can-I-avoid-Thailand-TDAC-arrival-card-scams

**为什么选**:反诈受众最精准,回答可以列具体识别清单,信息密度高。

**答案草稿:**

```
Maintainer disclosure: I run entrycardguide.com, an open-source anti-scam guide. With that bias on the table, here's a verifiable checklist.

The TDAC is free and only one URL legally accepts it: https://tdac.immigration.go.th

Three rules that catch >95% of TDAC scams:

1. Check the domain suffix. The official site ends in .go.th — a suffix reserved for Thai government entities. tdac.in.th, tdac.info, tdac.agents.co.th, thailand-tdac.com, and dozens of similar variants are NOT government sites no matter how official they look.

2. If you're being charged, you're on a reseller. The TDAC has zero government fee. Any site asking for $20–$90 is a middleman charging you for a free form.

3. Search-engine ranking ≠ legitimacy. Scam sites buy ads to sit above the official URL. Always type tdac.immigration.go.th directly or get the link from a verifiable source.

If you've already paid one of these sites: in many cases, the form was still submitted to the real government system, but you overpaid. Some travelers have successfully chargebacked the unauthorized fee through their card issuer with a "service was free" claim — your bank's documentation requirements vary.

For a current list of known scam domains with first-observed dates and DNS evidence, plus a side-by-side of the real form vs. fakes: https://entrycardguide.com/thailand/tdac/ — all data lives in a public GitHub repo, so the scam list is auditable rather than just our word for it.
```

---

## 目标问题 3:What is the price (cost) for Thailand TDAC forms?

**URL:** https://www.quora.com/What-is-the-price-cost-for-Thailand-TDAC-forms

**为什么选**:价格问题答案极短(免费),但反衬出"为什么有人收你钱"的反诈钩子,自然嵌入。

**答案草稿:**

```
Maintainer of entrycardguide.com here, so I'm biased — but this one's easy to verify.

The TDAC is FREE. Zero baht, zero dollars, zero government fee. The Royal Thai Immigration Bureau does not charge for it and never has.

If you've seen a price tag of $20, $35, $59, or anything in between, you're looking at a reseller — a third-party site that submits the same free form to the government and pockets the difference. There is no "premium" or "expedited" TDAC; the government processing time is the same regardless of who clicks Submit.

The official URL where the free form lives:
https://tdac.immigration.go.th

In late March 2026, Immigration Bureau spokesman Pol Maj Gen Choengron Rimpadee stated that at least 10% of foreign arrivals had used non-official sites and overpaid for the TDAC (reported across Bangkok Post and Thai-language press). That's the number that exists because resellers buy search ads above the real URL.

If you want a free walkthrough of every field on the form (validator runs in your browser, nothing stored), there's one here: https://entrycardguide.com/thailand/tdac/how-to-fill/
```

---

## 目标问题 4:How and where do I fill the Thailand "arrival form" online?

**URL:** https://www.quora.com/How-and-where-do-I-fill-the-Thailand-arrival-form-online

**为什么选**:基础 how-to 问题,适合给一个清晰的步骤答案,自然引到 how-to-fill 页。

**答案草稿:**

```
I maintain entrycardguide.com (open-source, free), so noting the bias upfront. Here's how it actually works.

The Thailand "arrival form" is now called the TDAC — Thailand Digital Arrival Card. As of May 1, 2025 it's mandatory for all foreign arrivals.

Where:
https://tdac.immigration.go.th — this is the only URL that legally accepts the form. The .go.th suffix is reserved for Thai government entities.

When:
Any time within 72 hours before your arrival in Thailand. Earlier than that, the system won't accept the submission.

What you'll need:
- Passport (the page with the photo and machine-readable zone)
- Flight number for arrival into Thailand
- Address of where you're staying the first night (hotel name + address is enough)
- Email address that you can check before arrival

Cost: Free. The government does not charge anything. If a site asks you for money, it's a third-party reseller, not the government.

Time to complete: About 8 minutes if you have the docs ready.

After submitting, you'll get a QR code by email. Save it offline (screenshot is fine). Show it to immigration on arrival.

A field-by-field walkthrough with the validator running locally in your browser (no data stored, no account needed): https://entrycardguide.com/thailand/tdac/how-to-fill/
```

---

## 目标问题 5:I applied for MDAC and it deducted $59 — is something wrong?

**URL:** https://www.quora.com/I-successfully-applied-for-a-digital-arrival-card-MDAC-to-Malaysia-and-it-deducted-59-from-my-account-Is-there-something-wrong-I-am-applying-for-a-Hong-Kong-passport-holder

**为什么选**:**最高 ROI 的一条**——受害者主动求证,回答能直接帮上忙(确认被坑、给 chargeback 路径),不是推销。

**答案草稿:**

```
I run entrycardguide.com, an open-source anti-scam guide for arrival cards. Bias noted — but this answer matters because what happened to you is happening to thousands of travelers.

Yes, something is wrong. The Malaysia Digital Arrival Card (MDAC) is FREE. The Malaysian Immigration Department does not charge any fee for it.

If $59 was deducted from your account, you applied through a third-party reseller, not the government. These sites typically rank in search ads above the real MDAC URL and look near-identical to the official portal.

The official, free MDAC URL:
https://imigresen-online.imi.gov.my/mdac/main

Two things to do now:

1. Check whether the real MDAC was actually submitted. Some resellers do submit your data to the government system after taking your fee — meaning you may already have a valid MDAC, just one you overpaid for. Look in your email for a confirmation directly from imi.gov.my (not from the reseller). If you have it, your MDAC is valid; you don't need to re-submit.

2. Consider a chargeback. Contact your card issuer and dispute the $59 charge. Your case: the service charged for is provided free by the Malaysian government; the reseller did not disclose this material fact. Some travelers have successfully recovered the fee. Bring documentation that the official MDAC is free (the imi.gov.my URL itself is enough).

For a current list of MDAC reseller domains and a side-by-side of the real form vs. lookalikes: https://entrycardguide.com/malaysia/mdac/ — the scam domain list is in a public GitHub repo with first-observed dates, so it's auditable.
```

---

## 目标问题 6:What is the purpose of the Singapore Entry Card, and who is required to fill it out?

**URL:** https://www.quora.com/What-is-the-purpose-of-the-Singapore-Entry-Card-and-who-is-required-to-fill-it-out

**为什么选**:基础信息题,但 SGAC 的"谁需要填"规则是真有混淆点(Singapore citizens 不用填,但很多人不知道),回答能提供高密度价值。

**答案草稿:**

```
Maintainer of entrycardguide.com (open-source, free), so disclosing the bias.

The SG Arrival Card (SGAC) is Singapore's digital replacement for the old paper disembarkation card. It's submitted to the Immigration & Checkpoints Authority (ICA) before you arrive.

Who must submit it:
- All foreign visitors entering Singapore by air, sea, or land
- Long-term pass holders re-entering after travel abroad

Who does NOT need to submit it:
- Singapore citizens
- Singapore Permanent Residents using the SC/PR e-passport lane
- Travelers transiting in Changi without clearing immigration

Where:
https://eservices.ica.gov.sg/sgarrivalcard/ — this is the only URL that legally accepts the SGAC. The .gov.sg suffix is reserved for Singaporean government entities.

Cost: Free. The ICA does not charge any fee. If a site asks for money to "process" your SGAC, it's a reseller charging for a free form.

When: Any time within 3 days before arrival.

Time to complete: About 5 minutes.

The SGAC also functions as your health declaration, so it's required even if Singapore is your transit point and you'll be clearing immigration to leave the airport.

For a field-by-field walkthrough that runs in your browser (no data stored): https://entrycardguide.com/singapore/sgac/
```

---

## 目标问题 7:How to fill out the arrival E-Ticket for the Dominican Republic?

**URL:** https://travelpros.quora.com/How-to-fill-out-the-arrival-E-Ticket-for-the-Dominican-Republic

**为什么选**:Dominican E-Ticket 流量小但竞争小,容易获得稳定排序;且这个版块(travelpros)对 maintainer 答案友好。

**答案草稿:**

```
Disclosure: I maintain entrycardguide.com, an open-source guide to free arrival forms. Bias noted — here's the actual answer.

The Dominican Republic E-Ticket is mandatory for all travelers arriving by air. It's also required at departure (a separate submission).

Official URL (the only one that legally accepts the form):
https://eticket.migracion.gob.do — the .gob.do suffix is reserved for Dominican government entities.

Cost: FREE. The Dirección General de Migración does not charge any fee. If a site is asking you for $25–$50, it's a reseller submitting the same free form on your behalf.

What you'll need:
- Passport
- Flight number and date of arrival
- Address where you're staying the first night
- Customs declaration info (cash over $10K USD, items to declare)

Steps:
1. Open eticket.migracion.gob.do directly (don't click a search ad — those are usually resellers).
2. Choose "Entrada" (Arrival).
3. Fill personal data + flight info + accommodation address.
4. Complete the customs declaration section honestly.
5. Submit. You'll get a QR code by email AND on screen — save both. The QR is what immigration scans on arrival.

When: Any time before your flight. There is no minimum lead time, but the QR code is needed at check-in for some airlines.

Time: 10–15 minutes including the customs section.

For a field-by-field walkthrough with the customs declaration questions explained in plain English: https://entrycardguide.com/dominican/eticket/
```

---

## 目标问题 8:How do I avoid fake TDAC websites for Thailand arrivals?

**URL:** https://www.quora.com/How-do-I-avoid-fake-TDAC-websites-for-Thailand-arrivals

**为什么选**:与问题 2 同主题,但措辞不同,可作为答题"续作",但**至少间隔 3 天**再发,且答案必须实质改写(不是问题 2 的复制)。

**答案草稿:**

```
I maintain entrycardguide.com — open-source anti-scam guide, so bias noted. Sharing what we've learned auditing these fakes.

The Thailand TDAC has exactly one official URL: https://tdac.immigration.go.th

Everything else is either a reseller (charges you for a free form, may or may not actually submit it) or a phishing site (collects your passport data with no intention of submitting anything). Both are common.

How to spot a fake in 5 seconds:

1. URL doesn't end in .go.th — instant fail. .go.th is reserved for Thai government entities. Anything ending in .com, .info, .in.th (note: in.th ≠ go.th), .net, .org is not official.

2. The site is asking for payment. Government TDAC has no fee. Real URL never collects card details.

3. The site uses "official-sounding" prefixes like "tdac.agents", "thailand-tdac", "tdac.online", "apply-tdac". These are common reseller patterns we've documented over the past year.

4. The site claims to offer "expedited processing" or "guaranteed approval." Government TDAC has no such tiers — same processing time for everyone.

5. The site appears as a search ad above the real URL. Resellers heavily out-bid the real government on search ads.

If you got tricked already: check your email for a confirmation FROM tdac.immigration.go.th (not from the reseller). If it's there, your TDAC is valid — you just paid for something free. Then dispute the charge with your card issuer on grounds of non-disclosure.

A current list of known fake TDAC domains with DNS evidence and first-observed dates is here: https://entrycardguide.com/thailand/tdac/ (scroll to the scam domain section). The list is in a public GitHub repo so anyone can audit how it was built — we removed 13 dead entries in one cleanup commit because a short, real list beats a long stale one.
```

---

## 1 周节奏建议

```
Day 1: 问题 1 (TDAC official) + 问题 5 (MDAC $59 victim)
Day 2: 问题 6 (SGAC purpose)
Day 3: 问题 3 (TDAC price)
Day 4: 问题 7 (Dominican E-Ticket)
Day 5: 问题 2 (TDAC scams)
Day 7: 问题 4 (Thailand arrival form online)
Day 10: 问题 8 (avoid fake TDAC) — 间隔最长,因为与问题 2 同主题
```

每天发完后:
- [ ] 检查发出去的答案有没有被自动 hide(Quora 偶尔会对新号触发)
- [ ] 24h 内回复任何评论或追问
- [ ] **不要** 自己 upvote 自己,**不要** 喊朋友 upvote

## 一个月后回看的指标

- 哪条答案的 view 数 > 1000(Quora 显示)
- 哪条带来的站点 referral 流量最高(Plausible/GA 看)
- 是否有评论提到具体假站(我们可以加进 scam_sites TOML)

把这三个数据回来,我们再决定下一批选哪 8 个问题。
