import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const root = process.env.GROWTH_TEST_TMP;
assert.ok(root, 'Set GROWTH_TEST_TMP to an external-volume test directory');
const dir = mkdtempSync(path.join(root, 'search-data-'));
const stub = path.join(dir, 'fetch.mjs');
writeFileSync(stub, `import {appendFileSync} from 'node:fs';
globalThis.fetch=async(url,options)=>{
 const body=JSON.parse(options.headers['Content-Type']==='application/json'?options.body:'{}');
 appendFileSync(process.env.REQUEST_LOG,JSON.stringify({url,body})+'\\n');
 let result={access_token:'test'};
 if(url.includes('searchAnalytics'))result={rows:[]};
 if(url.includes(':runReport')) result={rowCount:2,metadata:{timeZone:'Asia/Shanghai'},rows:[{dimensionValues:body.dimensions.map(()=>({value:'test'})),metricValues:body.metrics.map(()=>({value:'1'}))}]};
 return {ok:true,text:async()=>JSON.stringify(result)};
};`);
const output = path.join(dir, 'output');
const result = spawnSync(process.execPath, ['--import', stub, path.resolve('scripts/fetch-search-data.mjs'), '--days=28', '--end-date=2026-09-11', `--output-dir=${output}`], {
 cwd:dir, encoding:'utf8',env:{...process.env,GOOGLE_OAUTH_CLIENT_ID:'test',GOOGLE_OAUTH_CLIENT_SECRET:'test',GOOGLE_OAUTH_REFRESH_TOKEN:'test',REQUEST_LOG:path.join(dir,'requests.jsonl')}, timeout:15000,
});
assert.equal(result.status,0,result.stderr);
const requests=readFileSync(path.join(dir,'requests.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
const gsc=requests.find(r=>r.url.includes('searchAnalytics')).body;
assert.equal(gsc.startDate,'2026-08-15');
assert.equal(gsc.endDate,'2026-09-11');
assert.equal(gsc.dataState,'final');
const ga=requests.find(r=>r.url.includes(':runReport')).body;
assert.ok(JSON.stringify(ga.dimensionFilter).includes('entrycardguide.com'));
const conversion = requests.find(r => r.url.includes(':runReport') && r.body.dimensions.some(d=>d.name==='pagePath'));
assert.ok(conversion, 'official-click page report requested');
assert.ok(JSON.stringify(conversion.body.dimensionFilter).includes('official_link_click'), 'click report is filtered to the event');
assert.ok(JSON.stringify(conversion.body.dimensionFilter).includes('1280x1200'), 'production filtering is retained for click reports');
const dirOut=path.join(output,'2026-09-11-28d');
assert.equal(JSON.parse(readFileSync(path.join(dirOut,'ga4-source-medium.json'))).length,2,'GA4 pages are combined');
assert.ok(JSON.parse(readFileSync(path.join(dirOut,'report-metadata.json'))).reports['ga4-source-medium'].metadata);
console.log('Search data CLI checks passed.');
