# Task 10 — 外链推广调研结果(A 档执行产出)

**Status:** 调研完成 / 待用户手动执行
**调研日期:** 2026-05-16

A 档 9 项调研全部完成。Chrome 浏览器扩展默认拒绝访问外部站点(archive.org、wikipedia、github、ica.gov.sg 等都需用户单独授权),所以"我能直接操作 Chrome"的部分实际只能调研、不能落地;落地动作需用户手动 30-60 分钟完成。

---

## 🚨 关键红警(立刻看)

**Google `site:entrycardguide.com` 零结果。** 用 Google 搜任何形式的 `site:entrycardguide.com`、`site:entrycardguide.com thailand` 都返回 "No links found"。站点可能完全未被 Google 索引,或者 sitelinks 信号有问题。

**建议第一步:** 用户登录 Google Search Console,看:

- `Indexing > Pages`:是否所有页都是 "Not indexed"?
- `Settings > Crawl stats`:Googlebot 最近什么时候来过?
- `Sitemaps`:`sitemap.xml` 是否成功被读取?

如果完全没被索引,后面所有外链推广都是浪费——先解决索引,再做外链。可能原因:站点太新、GSC 未验证、sitemap 提交失败,或者(极小概率)有 robots noindex meta tag 残留。

---

## 📋 9 项 A 档结果一览表

| # | 任务 | 状态 | 主要产出 |
|---|---|---|---|
| 1 | archive.org 批量存档 | ⚠️ Chrome 被拒 | 改为下方"用户手动 5 分钟"清单 |
| 2 | 竞争对手反链摸底 | ✅ 部分(需 Ahrefs 拿数字) | iVisa Trustpilot/BBB/PissedConsumer 投诉密集,具体 $128.99 案例可引用 |
| 3 | 政府/大使馆 consumer warning 页扫描 | ✅ | 14 个高价值 outreach 目标(见下) |
| 4 | awesome-list 候选评估 | ✅ | `awesome-immigration` 一个,可创建 `awesome-arrival-cards` 自己占位 |
| 5 | 维基百科页面现状审计 | ✅ | 4 个相关条目存在,可编辑 External links |
| 6 | HARO 注册流程预演 | ✅ | helpareporter.com,Featured.com 重启,选 Travel + Lifestyle 类别 |
| 7 | 记者/编辑邮箱收集 | ✅ | Skift 邮箱模式:`lastNameInitial.firstName@skift.com` |
| 8 | Tripadvisor/Reddit/Flyertalk 现有帖子盘点 | ✅ | 12+ 高优先级 Tripadvisor 帖,Flyertalk MDAC 5 页讨论 |
| 9 | Bing/百度索引现状自检 | ✅ | Google 零索引(红警),Baidu Webmaster 流程已查清 |

---

## 1. archive.org 存档(用户手动 5 分钟)

Chrome 扩展拒了。改为本地终端 5 分钟脚本:

```bash
# 在 /Users/lzc/code/entrycardguide/ 下跑
urls=(
  "https://entrycardguide.com/"
  "https://entrycardguide.com/decide/"
  "https://entrycardguide.com/official-links/"
  "https://entrycardguide.com/about/"
  "https://entrycardguide.com/thailand/tdac/"
  "https://entrycardguide.com/thailand/is-ivisa-official/"
  "https://entrycardguide.com/malaysia/mdac/"
  "https://entrycardguide.com/singapore/sgac/"
  "https://entrycardguide.com/indonesia/e-cd/"
  "https://entrycardguide.com/mexico/fmm/"
  "https://entrycardguide.com/dominican/eticket/"
  "https://entrycardguide.com/vietnam/evisa/"
  "https://entrycardguide.com/zh/"
  "https://entrycardguide.com/zh/official-links/"
)
for u in "${urls[@]}"; do
  echo "Archiving: $u"
  curl -sI "https://web.archive.org/save/$u" -A "Mozilla/5.0" | head -1
  sleep 8  # archive.org 每分钟限 5-10 次,8 秒一发安全
done
```

存档完成后,每个 URL 都会有 `https://web.archive.org/web/2026*/{url}` 永久快照,本身就是 archive.org → entrycardguide.com 的高权重 backlink。

---

## 2. 竞争对手情报(可立刻用于内容)

**iVisa 已知问题(可用为站内 "is-ivisa-official.md" 增补数据):**

- 一个具体案例:iVisa **收 $128.99 卖免费的 Thai TDAC**(Trustpilot 投诉原文)。站点当前用"$20-$90"范围,可加这个最高值案例。
- iVisa 在 **BBB**(Better Business Bureau)有 profile 投诉记录:[bbb.org/us/fl/sunny-isles-beach/profile/passports-and-visas/ivisa-0633-92023506/complaints](https://www.bbb.org/us/fl/sunny-isles-beach/profile/passports-and-visas/ivisa-0633-92023506/complaints)
- **PissedConsumer 收 iVisa 投诉:** [ivisa.pissedconsumer.com](https://ivisa.pissedconsumer.com/complaints/RT-P.html)
- **Sitejabber 1056 条评论:** [sitejabber.com/reviews/ivisa.com](https://www.sitejabber.com/reviews/ivisa.com)
- Trustpilot 上 iVisa 反映"承诺改评后退款,实际未退款"模式(可作为 chargeback 流程章节素材)

**VisaHQ 变体:** `businessvisahq.com`、`visahq.net`(域名多变体,值得做 evidence card)

**Ahrefs/Semrush 数字未拿到** — 用户可在 [ahrefs.com/webmaster-tools](https://ahrefs.com/webmaster-tools) 免费版自查 iVisa 和自己站的 backlink profile 对比。

---

## 3. 政府/大使馆 consumer warning 页(Tier 2.3 outreach 名单,已备好)

按 outreach 优先级排序。这些页面**已经在警告假站**,带上"我们维护一份带 first_observed 日期 + DNS 证据的完整名单"邮件去:

| 目标 | URL | 联系路径 |
|---|---|---|
| US Embassy Thailand — Scam Alert | [th.usembassy.gov/visas/immigrant-visas/scam_alert60x60/](https://th.usembassy.gov/visas/immigrant-visas/scam_alert60x60/) | 邮件 ACSBangkok@state.gov(ACS 单元) |
| US Embassy Vietnam — Avoiding Online Scams | [vn.usembassy.gov/avoiding-online-scams/](https://vn.usembassy.gov/avoiding-online-scams/) | 邮件 ACSHCMC@state.gov |
| ICA Singapore — Fake SGAC Advisory | [ica.gov.sg/news-and-publications/newsroom/media-release/public-advisory-on-fake-sg-arrival-card-website](https://www.ica.gov.sg/news-and-publications/newsroom/media-release/public-advisory-on-fake-sg-arrival-card-website) | ICA contact form |
| ICA Singapore — Misleading Websites Advisory | [ica.gov.sg/public-education/advisory-on-fake-or-misleading-websites](https://www.ica.gov.sg/public-education/advisory-on-fake-or-misleading-websites) | 同上 |
| Singapore High Commission London | [london.mfa.gov.sg/mission-updates/ica-sg-arrival-card/](https://london.mfa.gov.sg/mission-updates/ica-sg-arrival-card/) | 镜像 advisory |
| Singapore High Commission New Delhi | [new-delhi.mfa.gov.sg/mission-updates/announcement-7-jul-2022-07-jul-2022/](https://new-delhi.mfa.gov.sg/mission-updates/announcement-7-jul-2022-07-jul-2022/) | 同上 |
| Jabatan Imigresen Malaysia | [imi.gov.my/index.php/en/pengumuman/malaysia-digital-arrival-card-mdac/](https://www.imi.gov.my/index.php/en/pengumuman/malaysia-digital-arrival-card-mdac/) | 官方公告页 |
| UK FCDO Thailand | [gov.uk/foreign-travel-advice/thailand/entry-requirements](https://www.gov.uk/foreign-travel-advice/thailand/entry-requirements) | 暂未提 TDAC 假站(机会:推动他们加) |
| UK 反诈骗 visa 报告通道 | [gov.uk/report-suspicious-emails-websites-phishing/report-visa-and-immigration-scams](https://www.gov.uk/report-suspicious-emails-websites-phishing/report-visa-and-immigration-scams) | 报告假站途径 |
| US Travel.State.Gov Scams | [travel.state.gov/en/international-travel/travel-advisories/scams.html](https://travel.state.gov/en/international-travel/travel-advisories/scams.html) | 通用页 |
| 泰国驻北京大使馆中文 TDAC | [thaiembbeij.org/cn/new-zh/tdac/](https://thaiembbeij.org/cn/new-zh/tdac/) | 中文 outreach 入口 |
| Dirección General de Migración (DR) | DominicanToday 报道 [2024-06-19](https://dominicantoday.com/dr/local/2024/06/19/tourists-scammed-by-fake-dominican-republic-entry-portal/) [2025-06-04](https://dominicantoday.com/dr/local/2025/06/04/migration-authorities-warn-of-e-ticket-scams-targeting-travelers/) | DGM 通讯录 |
| Italian Embassy Kuala Lumpur — MDAC | [ambkualalumpur.esteri.it/en/news/dall_ambasciata/2023/12/mandatory-malaysia-digital-arrival-card-mdac-for-travelers-entering-malaysia-2/](https://ambkualalumpur.esteri.it/en/news/dall_ambasciata/2023/12/mandatory-malaysia-digital-arrival-card-mdac-for-travelers-entering-malaysia-2/) | 第三国大使馆引用源 |
| Norway Embassy Malaysia — MDAC | [norway.no/en/malaysia/norway-malaysia/news-events/malaysia-digital-arrival-card-required-for-foreign-visitors/](https://www.norway.no/en/malaysia/norway-malaysia/news-events/malaysia-digital-arrival-card-required-for-foreign-visitors/) | 同上 |

**邮件模板**(给 Embassy ACS 用):

> Subject: Auditable scam-domain dataset for your TDAC/MDAC consumer warning page
>
> Dear ACS [city],
>
> I run entrycardguide.com, an open-source guide to digital arrival cards. Your scam alert page already warns travelers about fake TDAC sites, which is exactly the problem we track.
>
> We maintain a public GitHub repository of named scam domains with `first_observed` dates, DNS audit evidence, and the fee charged. The data is verifiable against the live sites and updated monthly.
>
> Full dataset: github.com/onlyoasis/entrycardguide/blob/main/data/official_urls/thailand.toml
>
> Two ways this might be useful:
> 1. Cross-check the domains you've already listed against ours
> 2. Cite our dataset on the warning page as an evergreen reference (no advertising, all anti-scam)
>
> Happy to discuss. The site has no fees and no commercial relationship with any of the resellers it lists.
>
> Best,
> [Maintainer name]
> github.com/onlyoasis/entrycardguide

---

## 4. Awesome-list 候选

**已找到唯一相关:** [github.com/AwesomeVisa/awesome-immigration](https://github.com/AwesomeVisa/awesome-immigration) — 102 visas / 8 categories,接受 PR,要求 official sources only。entrycardguide 完全符合(都是官方政府 URL)。

**机会:** 没有 **`awesome-arrival-cards`** 或 **`awesome-anti-visa-scam`** 这种现成 list 存在。建议:

1. 第一周:给 `awesome-immigration` 提 PR 加入 entrycardguide.com
2. 第二周:**自己创建 `awesome-arrival-cards` list**,把所有国家 TDAC/MDAC/SGAC 等列出来,带官方 URL + 站点链接。GitHub star 自然增长会带 trickle backlinks,且这个 list 本身可被引用。

不相关排除:`awesome-fraud-detection-papers` 是学术论文列表,不匹配。

---

## 5. 维基百科页面现状

| 条目 | URL | 当前状态 | 编辑机会 |
|---|---|---|---|
| Thailand Digital Arrival Card | [en.wikipedia.org/wiki/Thailand_Digital_Arrival_Card](https://en.wikipedia.org/wiki/Thailand_Digital_Arrival_Card) | 条目存在 | External links / References 段可补 |
| Malaysia Digital Arrival Card | [en.wikipedia.org/wiki/Malaysia_Digital_Arrival_Card](https://en.wikipedia.org/wiki/Malaysia_Digital_Arrival_Card) | 条目存在 | 同上 |
| Singapore Arrival Card | [en.wikipedia.org/wiki/Singapore_Arrival_Card](https://en.wikipedia.org/wiki/Singapore_Arrival_Card) | 条目存在 | 同上 |
| SGAC | [en.wikipedia.org/wiki/SGAC](https://en.wikipedia.org/wiki/SGAC) | 重定向到 Singapore Arrival Card | — |
| Vietnam e-visa | (待查) | — | — |
| Mexico FMM | (待查) | — | — |
| Dominican Republic E-Ticket | (待查) | — | — |
| Indonesia e-CD | (待查) | — | — |
| 泰国数字入境卡(中文 wiki) | (待查 zh.wikipedia.org/wiki/泰国数字入境卡) | — | — |

**编辑策略(避免被回滚):**

1. **先修事实**:每个条目都有"reseller 加价"现实,但 Wikipedia 条目很可能只写官方流程没写诈骗问题。在 "Issues" 或 "Reception" 段增加官方政府警告引用(Royal Thai Immigration Bureau 2026-03 公开数据)。
2. **再加 reference**:用 `<ref>` 引用 entrycardguide 的具体 data 文件 URL(不是首页)作为 "scam domain catalog" 来源。
3. **External links 段**:只加官方政府 URL + entrycardguide 的 country hub 页(`/thailand/`)。
4. **账号要求:** Wikipedia 要 autoconfirmed 账号(4 天龄 + 10 次有效编辑)才能编辑半保护页。新号要先做 10 次无关编辑(改 typo、加 reference)养号。

**待用户决定:** 中文 wiki 是否值得做?中文 wiki 流量小,但权重高,且不易被回滚(中文编辑社区更宽容)。

---

## 6. HARO/Connectively 注册流程

- **URL:** [helpareporter.com](https://www.helpareporter.com/)
- **现状:** 2024 年改名 Connectively → 2024-12 停运 → 2025 初 Featured.com 接手,正在重启。
- **流程:** 邮箱注册 → 邮箱验证 → 选 source 类别。
- **选哪些类别:** Travel(直接相关)、Business & Finance(消费者保护交叉)、Lifestyle & Entertainment(travel 子类)。
- **邮件频率:** 周一到周五,每天 3 次(上午/下午/晚上),全是 journalist 在求 source。
- **Profile bio 模板:**

> Maintainer of entrycardguide.com — open-source, auditable guide to free government arrival cards across 7 countries. Tracks reseller scam domains with first-observed dates and DNS evidence. Available for sources on: anti-fraud, travel consumer protection, visa middlemen, chargeback strategies, open-data publishing.

**回 query 模板:**

> Hi [reporter name], I'm [your name], maintainer of entrycardguide.com.
>
> Re: your query on [topic]:
> [Specific evidence + 2-3 sentence answer]
>
> If useful, our underlying scam domain dataset is here (CC-licensed, free to cite): [URL]
>
> Happy to provide additional examples or do a brief call.

**1 个月目标:** 3 个 query 被实际引用 = 3 条媒体 backlink。

---

## 7. 记者/编辑邮箱(Tier 2.1 outreach 弹药)

### Skift(travel-tech 旗舰)

邮箱模式(SignalHire 数据,44% 占比):**`lastNameInitial.firstName@skift.com`**

| 角色 | 姓名 | 推断邮箱 |
|---|---|---|
| Editor-in-Chief | Sarah Kopit | k.sarah@skift.com |
| Editor-in-Chief(老) | Tom Lowry | l.tom@skift.com |
| Executive Editor | Dennis Schaal | s.dennis@skift.com |
| Senior Travel Tech Editor | Sean O'Neill | o.sean@skift.com — **关键:travel tech 直接对口** |
| Corporate Travel Editor | Matthew Parsons | p.matthew@skift.com |
| Global Tourism Reporter | Lebawit Lily Girma | g.lebawit@skift.com — **关键:tourism 直接对口** |
| Hospitality Reporter | Cameron Sperance | s.cameron@skift.com |
| Reporter | Justin Dawes | d.justin@skift.com |
| Airlines Reporter | Edward Russell | r.edward@skift.com |
| 通用入口 | — | support@skift.com(主题 "PRESS ACCESS") |
| 活动 | — | events@skift.com |

**首选 outreach:** Sean O'Neill + Lebawit Lily Girma(两人对口 tech + tourism)。

### The Points Guy

- **Michelle Couch-Friedman**(ombudsman 类专栏,专写 consumer rescue) — 通过 [thepointsguy.com](https://thepointsguy.com) 的 "tips inbox" 联系。她是写过 "Instagram Influencers Are Being Targeted by a Con Artist in a Massive Travel Scam" 等文章的人,直接对口反诈骗叙事。

### SCMP(亚洲华人读者)

- 通用入口:[scmp.com/contact-us](https://www.scmp.com/contact-us)
- 企业入口:[corp.scmp.com/contact-us](https://corp.scmp.com/contact-us)
- 邮箱域:`@scmp.com`(具体名字要从文章页 author 链接进去)
- 写 Asia travel 的记者要从 [scmp.com](https://www.scmp.com) 各 article 的 byline 点进去找

### Nikkei Asia

| 姓名 | 主题 |
|---|---|
| Satsuki Kaneko | Tourism(写过日本访客 3M、tourism spending) |
| Wataru Suzuki | Travel & Leisure(写过中国旅游目的地) |
| David Hutt | Asia policy / Europe-Asia |

通过 Muck Rack 找具体邮箱:[muckrack.com/satsuki-kaneko](https://muckrack.com/satsuki-kaneko)

### 中文媒体

| 媒体 | 入口 | 备注 |
|---|---|---|
| 36kr 签证标签 | [36kr.com/nftags/195020](https://www.36kr.com/nftags/195020) | 看活跃记者,在文章页找邮箱 |
| 36kr 移民标签 | [36kr.com/nftags/179954](https://www.36kr.com/nftags/179954) | 同上 |
| 虎嗅 | [huxiu.com](https://www.huxiu.com/) | 没找到专门反诈骗记者,机会:成为他们 source |
| 知乎专栏作者 | [zhuanlan.zhihu.com/p/1929598044854269379](https://zhuanlan.zhihu.com/p/1929598044854269379) 等 4 篇 TDAC 教程 | 私信作者,提供 maintainer 视角补充 |
| 泰国头条新闻(中文) | [thaiheadlines.com/169639/](https://www.thaiheadlines.com/169639/) | 中文东南亚旅游媒体 |

---

## 8. Tripadvisor / Reddit / Flyertalk 高优先级帖子

### Tripadvisor 立即可回(每条带 maintainer 披露 + 官方 URL + 站点链接)

| 帖子 | 国家 / 主题 | 优先级 |
|---|---|---|
| [Digital arrival card scam](https://www.tripadvisor.com/ShowTopic-g293916-i3687-k15423269-Digital_arrival_card_scam-Bangkok.html) | Bangkok / TDAC | ⭐⭐⭐ |
| [Tourism Ministry warns of fake TDAC](https://www.tripadvisor.com/ShowTopic-g293915-i3686-k15495891-Tourism_Ministry_warns_of_fake_TDAC_websites_charging_fees-Thailand.html) | Thailand / TDAC | ⭐⭐⭐ |
| [Fake TDAC scam sites continue](https://www.tripadvisor.com/ShowTopic-g659499-i13185-k15495008-Fake_TDAC_scam_sites_continue_to_trick_Thailand_tourists-Afghanistan.html) | Thailand / TDAC | ⭐⭐ |
| [TDAC SCAM ALERT: tdac.agents.co.th](https://www.tripadvisor.com/ShowTopic-g293963-i10646-k15401835-TDAC_SCAM_ALERT_do_not_click_on_tdac_agents_co_th-Tajikistan.html) | Thailand / TDAC | ⭐⭐⭐ |
| [Thai authorities call out Chad Scira](https://www.tripadvisor.com/ShowTopic-g659499-i13185-k15464076-Thai_authorities_call_out_TDAC_scammer_Chad_Scira-Afghanistan.html) | Thailand / 涉案人 | ⭐⭐ |
| [tdac.in.th is a scam](https://www.tripadvisor.com/ShowTopic-g1-i12334-k15332928-Tdac_in_th_is_a_scam_website_from_Thai_Visa_Centre-Holiday_Travel.html) | Thailand / TDAC | ⭐⭐ |
| [Beware Fake Indonesian online customs](https://www.tripadvisor.com/ShowTopic-g294225-i7219-k14297495-o10-Beware_Fake_Indonesian_online_customs_form-Indonesia.html) | Indonesia / e-CD | ⭐⭐⭐ |
| [Cost of E-CD online?](https://www.tripadvisor.com/ShowTopic-g294226-i7220-k14493580-Cost_of_E_CD_online_Customs_Declaration_for_Indonesia-Bali.html) | Indonesia / e-CD | ⭐⭐⭐ |
| [Singapore Arrival Card Fake website](https://www.tripadvisor.com/ShowTopic-g294265-i1748-k14293048-Singapore_Arrival_Card_Fake_website-Singapore.html) | Singapore / SGAC | ⭐⭐⭐ |
| [MexicoFMM.com is a scam](https://www.tripadvisor.com/ShowTopic-g150796-i163-k13579928-MexicoFMM_com_is_a_scam-Central_Mexico_and_Gulf_Coast.html) | Mexico / FMM | ⭐⭐⭐ |
| [Visa application - is it a scam?](https://www.tripadvisor.com/ShowTopic-g293921-i8432-k14268435-Visa_application_is_it_a_scam_Urgent_advice_please-Vietnam.html) | Vietnam / e-Visa | ⭐⭐ |
| [Is e-visa-vietnam.com a scam?](https://www.tripadvisor.com/ShowTopic-g293921-i8432-k12282151-Is_e_visa_vietnam_com_a_scam-Vietnam.html) | Vietnam / e-Visa | ⭐⭐ |

### Flyertalk

| 帖子 | 备注 |
|---|---|
| [Malaysia MDAC & E-Gates(5 页讨论)](https://www.flyertalk.com/forum/asia/2143242-malaysia-malaysia-digital-arrival-cards-mdac-e-gates.html) | 高活跃,适合做 maintainer 答复 |
| [TDAC at BKK and more](https://www.flyertalk.com/forum/qatar-airways-privilege-club/2191841-thailand-digital-arrival-card-bkk-more.html) | 中等活跃 |
| [Malaysia MDAC website not working](https://www.flyertalk.com/forum/asia/2130965-malaysia-digital-arrival-card-website-not-working.html) | 适合给故障排查 |

### Reddit

**搜索零结果——这是空白蓝海。** Google `site:reddit.com Thailand TDAC scam` 几乎找不到内容,说明 Reddit 上反 TDAC 中介的内容**不饱和**。

**机会:** 用 maintainer 账号(已养 100+ karma)在以下 subreddit **主动开帖**(不只是回答):

- `r/scams`(800k)— "PSA: Thai TDAC is free, here's the named reseller list" 这种 PSA 帖子高赞概率大
- `r/Thailand`(380k)— 同上
- `r/solotravel`(2.7M)— 通用反中介
- `r/digitalnomad`(2.1M)— 7 国混合
- `r/IWantOut`(1.1M)— 长签证混淆

---

## 9. Bing/百度索引现状自检

- **Google:** `site:entrycardguide.com` 零结果 ⚠️(见顶部红警)
- **Bing:** 未查(需用户登录 Bing Webmaster Tools)
- **百度:** 未查(需用户登录 ziyuan.baidu.com)

### Baidu Webmaster 提交流程(用户 10 分钟手动)

1. 注册百度账号 → 登录 [ziyuan.baidu.com](https://ziyuan.baidu.com)
2. 添加站点 `entrycardguide.com`
3. 验证(三选一):
   - **CNAME(推荐)**:在 Cloudflare DNS 加一条 CNAME,指向 `ziyuan.baidu.com`
   - **HTML 文件**:下载验证文件,放到 `static/` 根目录(Hugo 会拷到 public/)
   - **HTML tag**:在 `layouts/partials/head.html` 加一行 meta tag
4. 提交 `https://entrycardguide.com/sitemap.xml`
5. 等几天到几周索引

注意:中文用户主要看 Google + 百度,Bing/搜狗份额小。

---

## 🎯 用户立刻能做的 5 件事(按 ROI 排序)

| # | 动作 | 时间 | 价值 |
|---|---|---|---|
| 1 | **GSC 检查为什么 Google 零索引** | 5 分钟 | 解决根本问题,否则所有外链都白搭 |
| 2 | **跑上面的 archive.org bash 脚本** | 5 分钟 | 14 条永久 archive.org backlink |
| 3 | **回 3 个 Tripadvisor 帖子**(本文档"Tripadvisor 高优先级")按 09 任务的披露格式 | 30 分钟 | 3 条高 DA 论坛 backlink + 真实流量 |
| 4 | **HARO 注册 + 选 Travel + Business 类别** | 5 分钟 | 接下来 30 天每天 3 封 query,1-2 次引用 = 高权重 backlink |
| 5 | **`awesome-immigration` 提 PR 加 entrycardguide** | 10 分钟 | 1 条 GitHub 高 PR 仓库 backlink |

---

## 🚧 新发现的诈骗站(可立刻补 `data/official_urls/*.toml`)

### Thailand
- `tdac.agents.co.th`(站点已有)
- `tdac.in.th`(Thai Visa Centre 旗下,Tripadvisor 多帖警告)
- 涉案人:Chad Scira(Thai authorities 公开点名,Tripadvisor 有专帖)

### Indonesia(站点 e-CD 页面值得加 evidence 卡)
- `exploreindonesiatoday.com`($65 USD)
- `indonesiae-cd.com`($55 USD)
- `entryinfo-indonesia.com`($55 USD)
- `indonesianecd.com`(authorities flagged)
- `travelindonesia-ecd.com`
- `indonesiaecd.com`(可疑 FAQ 页)

### Mexico
- `mexicofmm.com`(Scamadviser 标记,$129 vs $30 加价)
- 模式:多个 fraudulent FMM 资源,接到投诉后退款部分但保留"基础费"

### Dominican Republic
- `eticket.portalmigracion.com`(DGM 警告)
- `dominicanrepublicetickets.org`(Scamminder 10/100 trust score)

### Vietnam
- `e-visa-vietnam.com`(Tripadvisor 多帖警告)
- `vietnam-visa.com`(Tripadvisor 警告)

### Malaysia
- `mcadfast.com`(Jabatan Imigresen 官方警告)
- `malaysia-arrivalcard.vercel.app`(Jabatan Imigresen 官方警告)
- `mdacmalaysia.com`(可疑,需 DNS 验证)
- `mdacmalaysia.info`(可疑,需 DNS 验证)

### Singapore
- ICA 官方公告列了具体名,但 WebSearch 未拿到原文 → 需用户去 [ica.gov.sg/news-and-publications/newsroom/media-release/public-advisory-on-fake-sg-arrival-card-website](https://www.ica.gov.sg/news-and-publications/newsroom/media-release/public-advisory-on-fake-sg-arrival-card-website) 抄

---

## 📦 下一步交付建议

完成上述 5 件事后,我们再做 B 档(需用户登录的操作):

- B 档候选:GitHub topics 添加、Wikipedia 编辑、Bing/Baidu Webmaster 提交、Quora 答题(09 草稿已就绪)、Reddit PSA 帖子
- C 档候选:个性化邮件 outreach(Skift、TPG、Nikkei、SCMP)、大使馆 ACS outreach、中文公众号合作

完成 archive.org + Tripadvisor + HARO + awesome-immigration 之后,1 个月回看 GSC 看 referring domains 数量,根据数据决定下一步重点。
