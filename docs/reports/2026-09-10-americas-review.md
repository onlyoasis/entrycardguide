# 美洲12地首轮独立评审：暂不通过

## 实查问题

1. 写入过程中GT曾JSON解析失败；任务结束后必须对全部12文件重新json.load，不以先前自报合法为据。
2. summary重复计SV，3+8+2=13而实际12。依据实际JSON重新计算互斥状态，不写最高/高置信这种不可验证评价。
3. 当前状态verified_with_open_items/weak、fee amount字符串unknown、unresolved字符串数组、sources缺supports，与网站schema不兼容。归一化为verified/partial/blocked、fee为unknown或数值对象、unresolved对象、来源supports准确指向事项。
4. BZ仅JS语言选择页、HN仅首页入口，却有verified_at；这些不能证明表单适用人群/时间，具体事项应null或仅保留有证据的入口事实。NI timing把搜索摘要3天写进正文，应移到unresolved。
5. UY当前记录使用2014旧额度。主控实际打开 https://www.gub.uy/tramites/equipaje-viajeros-gestion-franquicia-equipaje （更新2026-06-26）：空/海路500美元、陆路300、额度每月最多一次、未满18岁返国旅客50%；到港免税店额外850（Decreto376/022）。原300/500/150及免税店500过时，必须实际核实后改用现行规则，保留来源日期差异。
6. CR将中美洲比索按惯例换算美元、且2009决议后修订未核，不可当精确美元事实；核现行官方规则，或仅保留原单位并注明待核，不能用近似值充当前确定值。
7. SR的icf.sr域名需官方链证明（gov.sr有Guide-For-Immigrants.pdf指向，另新加坡外交部也指向 https://icf.sr/start-general/）；主控已能打开ICF正文。10000美元禁携条款必须保持与申报义务的区别，不能套其他国家的通常做法。
8. 所有关键数值都需要实际官方原文。raw/*.md如果只是自己重述而非原始段落，不得称全文或verbatim。单来源摘录累计<=25词，来源复制多条不扩大额度。

## 归一化输出边界

非洲任务同时拥有仓库母表。此修复任务仅在 runtime/global-20260910/americas-research 下工作：修原研究记录、生成 normalized/records/{12ISO}.json 及 normalized/jurisdictions-updates.json，不直接改仓库母表/records/脚本。完成时在外盘建立独立validation-root，把当前库复制后仅替换/追加12地与母表行，调用仓库scripts/check-travel-library.mjs对该root验收。不要修改预期或校验器去迎合数据。

全部12地均需保留研究记录，证据不足明确partial/blocked，并继续补查主要海关义务；不以入口清单代替用户要的资料。自查和主控独立验收分开。
