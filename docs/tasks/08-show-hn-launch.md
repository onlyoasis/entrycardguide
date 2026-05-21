# Show HN 发布草稿

**计划发布时间:2026-05-12(周二)21:00 北京时间(美东 09:00)**

发布地址: https://news.ycombinator.com/submit

## 标题(粘到 Title 栏)

推荐(朴素版):

```
Show HN: Entrycardguide – open-source, auditable guides to free arrival cards
```

备用(钩子版,标题党风险更高):

```
Show HN: I built an anti-scam guide after Thailand said 10% of tourists overpay
```

## URL(粘到 URL 栏)

```
https://entrycardguide.com
```

## Text 栏

**留空**。Show HN 同时填 URL 和 Text 会被 HN 系统降权。所有正文放进发帖后的第一条置顶评论。

## 第一条置顶评论(发完帖立即回复)

```
Author here. A few things that didn't fit in a one-line post.

In late March 2026, Immigration Bureau spokesman Pol Maj Gen Choengron Rimpadee publicly stated that at least 10% of foreign arrivals had used unofficial sites to fill out the Thailand Digital Arrival Card — a free government form — and overpaid by $20 to $90. (Coverage: https://www.bangkokpost.com/thailand/general/3226524/immigration-warns-of-scam-digital-arrival-card-websites) That number is what got me to build this.

We cover 7 countries: Thailand (TDAC), Malaysia (MDAC), Singapore (SGAC), Indonesia (e-CD), Mexico (FMM-E), Dominican Republic (E-Ticket), Vietnam (E-Visa). Every one of these is free on a single official government URL. Every one of them has $20-$90 middlemen sitting at the top of Google search results.

What's on the site:
- Official URL for each country at the top of every guide, with last_verified date and a Wayback archive link.
- A field-by-field validator that runs entirely in your browser. Open DevTools, type into it, watch the network panel — no keystrokes leave your machine.
- Named scam domains with first-observed dates and DNS audit evidence. We removed 13 dead entries in one commit because a short real list beats a long stale one.
- A 60-second decision tool at /decide/ — pick destination, answer 1-2 follow-ups, get the exact list of forms you need given your nationality and entry mode.
- An /official-links/ directory page designed to be cited in forums and travel-agent FAQs, so one link can end "which one is the real site?" arguments.

How it's auditable (this is the part I actually care about):
- Official URLs: data/official_urls/{country}.toml
- Field rules: data/rules/{country}.json
- Scam domains: same TOML, with dated evidence
- Validator source: assets/js/validator.ts, runs locally
- Decision tree: data/decision/tree.json
- Everything in git history. Rule changes have dates and reasons.

Stack: Hugo static site, no DB, no accounts, no analytics that touch user form input. EN + Simplified Chinese.

Business model: SafetyWing travel insurance affiliate links, disclosed at the bottom of eligible guides. That is the entire model. We have never taken money from iVisa or any visa middleman and never will — it would invalidate the reason the site exists.

Repo: https://github.com/onlyoasis/entrycardguide

Feedback I'd love:
1. Countries we should add. (Holding off on ESTA/ETIAS/ETA — different model.)
2. Scam domains we've missed.
3. If you've chargebacked an iVisa-style charge successfully, what worked?
```

## 发布后 30 分钟保命清单

- [ ] 立即发上面的第一条置顶评论
- [ ] **不要** 自己刷新页面(HN 反作弊会降权)
- [ ] **不要** 喊朋友 upvote(被检测会 shadowban)
- [ ] 回复所有前 2 小时内的评论(包括吐槽)
- [ ] 把 GitHub 仓库 README 顶部加一行链接到 HN 帖子(让爬过来看仓库的人能回到讨论区)

## 常见反问预备答案

- **"How is this different from VisaHQ/iVisa?"** → 我们不是中介,只指官方网址,不替你填表。
- **"Why not just link to the government sites?"** → 看 /official-links/,我们就是那个目录。区别在于把字段、骗局、退款流程也放在一起。
- **"Affiliate = same incentive?"** → SafetyWing 不和我们指向的政府表单竞争,iVisa 是直接竞争对手。
- **"What about ESTA/ETIAS/ETA?"** → 不同模式(电子授权,不是入境卡),需要单独的指南。下一阶段考虑。
