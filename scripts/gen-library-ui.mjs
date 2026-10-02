#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { zh2hant } from './zh-hant/core.mjs';
const en = {
  home:'Home', library:'Global traveler library', destination:'Destination', region:'Region', status:'Coverage', procedures:'Published procedures', links:'Links', details:'Details', guide:'Guide',
  verified:'Verified scope', partial:'Partially verified', blocked:'Not yet verified', search:'Search', search_placeholder:'Name or ISO code', all_regions:'All regions', all_statuses:'All coverage states', reset:'Reset', empty:'No destination matches.', count:'{count} of {total} destinations',
  Africa:'Africa', Americas:'Americas', Asia:'Asia', Europe:'Europe', Oceania:'Oceania', 'Unspecified (M49)':'Other regions',
  index_intro:'Browse %d countries and areas. %d have verified research scope, %d have partial coverage, and %d remain unverified. Only procedures backed by recorded sources appear below. Empty results do not mean that no declaration is required.',
  checked:'Research reviewed', verification:'Source verification date', partial_note:'This destination has partial coverage. The procedures below have recorded supporting sources; other requirements remain unverified. Check the destination authority before traveling.',
  blocked_note:'Requirements for this destination remain unverified. No procedures are published here. This does not mean that no form or declaration is required.',
  verified_note:'These procedures have recorded sources for the researched scope. This is not a guarantee that every entry requirement or later change is covered. Check the official pages before traveling.',
  coverage:'%d published procedures; %d recorded procedures withheld; %d open research questions.',
  no_procedures:'No source-backed procedure is available for publication yet. This does not establish that no declaration is required. Check the destination authority and any existing guide.',
  procedure_heading:'Source-backed procedures', type:'Type', agency:'Authority', official_source:'Official page', channel:'Channel', fee:'Fee', unknown:'Not verified', free:'Free', timing:'When to apply', sources:'Sources', publisher:'Publisher',
  customs_declaration:'Customs declaration', arrival_card:'Arrival card', health_declaration:'Health declaration', travel_authorization:'Travel authorization', visa:'Visa', online:'Online', paper:'Paper', on_arrival:'On arrival', on_departure:'On departure', conditional:'Conditional',
  guide_note:'Existing guides cover a different scope from the research summary above.',
};
const zh = {
  home:'首页', library:'全球旅行资料库', destination:'目的地', region:'地区', status:'资料覆盖', procedures:'公开事项', links:'链接', details:'详情', guide:'现有指南',
  verified:'已核实范围', partial:'部分核实', blocked:'尚未核实', search:'搜索', search_placeholder:'名称或 ISO 代码', all_regions:'全部地区', all_statuses:'全部状态', reset:'重置', empty:'没有符合条件的目的地。', count:'{count} / {total} 个目的地',
  Africa:'非洲', Americas:'美洲', Asia:'亚洲', Europe:'欧洲', Oceania:'大洋洲', 'Unspecified (M49)':'其他地区',
  index_intro:'共 %d 个国家和地区，其中 %d 个在研究范围内已核实、%d 个部分核实、%d 个尚未核实。仅发布已有记录来源支持的事项。没有公开事项不代表无需申报。',
  checked:'研究复核日期', verification:'来源核实日期', partial_note:'该目的地仅部分核实。以下事项已有记录来源支持，其他要求仍待核实。出行前请向目的地主管机关确认。',
  blocked_note:'该目的地的要求尚未核实，因此不发布申报事项。这不代表无需填表或申报。',
  verified_note:'以下事项在已研究范围内有记录来源支持，不保证覆盖所有入境要求及后续变更。出行前请核对官方页面。',
  coverage:'公开 %d 项；记录内另有 %d 项暂不公开；仍有 %d 个研究问题待核。',
  no_procedures:'目前没有可公开的来源核证事项，不能据此判断无需申报。请查询目的地主管机关，并参考已有指南。',
  procedure_heading:'已有来源支持的事项', type:'类型', agency:'主管机关', official_source:'官方页面', channel:'办理渠道', fee:'费用', unknown:'尚未核实', free:'免费', timing:'办理时间', sources:'来源', publisher:'发布方',
  customs_declaration:'海关申报', arrival_card:'入境卡', health_declaration:'健康申报', travel_authorization:'旅行授权', visa:'签证', online:'在线', paper:'纸质', on_arrival:'入境时', on_departure:'离境时', conditional:'视情况',
  guide_note:'现有指南与本页研究摘要覆盖的范围不同。',
};
if (Object.keys(en).sort().join() !== Object.keys(zh).sort().join()) throw new Error('Library UI language keys differ');
const output=JSON.stringify({en, zh, 'zh-hant':Object.fromEntries(Object.entries(zh).map(([key,value])=>[key,zh2hant(value)]))},null,2)+'\n';
const path=resolve(import.meta.dirname,'../data/library_ui.json');
if(process.argv.includes('--check')) {
  if(readFileSync(path,'utf8')!==output) throw new Error('Library UI is stale. Run node scripts/gen-library-ui.mjs');
  console.log('Library UI translations fresh');
} else {writeFileSync(path,output); console.log('Wrote data/library_ui.json');}
