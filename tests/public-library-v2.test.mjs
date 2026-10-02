import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { projectPublicTravelLibrary, projectPublicTravelLibraryV2, validatePublicTravelLibrary, PRIVATE_RESEARCH_TEXT } from '../scripts/travel-library-public.mjs';

function fixture() {
 const jurisdictions=[{id:'JP',name_en:'Japan',name_zh:'日本',region:'Asia',existing_site_key:'japan'}];
 const procedures=[{id:'jp-customs',type:'customs_declaration',name_en:'Customs declaration',name_zh:'海关申报',agency:'Japan Customs',official_url:'https://www.customs.go.jp/english/',channel:'online',applicability_en:'Arriving travelers',applicability_zh:'入境旅客',timing_en:'On arrival',timing_zh:'入境时',fee:'unknown',source_ids:['jp-source'],verified_at:'2026-09-10'}];
 const sources=[{id:'jp-source',url:'https://www.customs.go.jp/english/',title:'Japan Customs',publisher:'Japan Customs',access_status:'ok',evidence_excerpt:'Declare goods on arrival.',supports:['jp-customs']}];
 const records=[{jurisdiction_id:'JP',review_status:'partial',researched_at:'2026-09-10',procedures,sources,unresolved:[{id:'jp-open',note:'Private research',next_check_url:'https://www.customs.go.jp/'}]}];
 return {jurisdictions,records};
}
function project(){const f=fixture();return projectPublicTravelLibraryV2(f.jurisdictions,f.records,['JP']);}

test('v2 preserves partial status and records honest published/withheld coverage',()=>{
 const snapshot=project();
 assert.equal(snapshot.schema_version,2);
 assert.equal(snapshot.records[0].review_status,'partial');
 assert.deepEqual(snapshot.records[0].coverage,{total_procedures:1,published_procedures:1,withheld_procedures:0,open_questions:1});
 assert.equal(snapshot.records[0].procedures[0].name_zh_hant,'海關申報');
 assert.deepEqual(validatePublicTravelLibrary(snapshot),[]);
 assert.doesNotMatch(JSON.stringify(snapshot),/Private research|evidence_excerpt|supports|unresolved|access_status/);
 const f=fixture();assert.throws(()=>projectPublicTravelLibrary(f.jurisdictions,f.records,['JP']),/verified/);
});

test('a date without one opened, excerpt-bearing, supporting source never publishes',()=>{
 for(const mutate of [s=>s.access_status='failed',s=>s.evidence_excerpt='',s=>s.supports=[]]) {
  const f=fixture();mutate(f.records[0].sources[0]);
  const snapshot=projectPublicTravelLibraryV2(f.jurisdictions,f.records,['JP']);
  assert.equal(snapshot.records[0].procedures.length,0);
  assert.equal(snapshot.records[0].coverage.withheld_procedures,1);
  assert.deepEqual(snapshot.records[0].sources,[]);
 }
});

test('blocked destinations remain present and never publish dated procedures',()=>{
 const f=fixture();f.records[0].review_status='blocked';
 const snapshot=projectPublicTravelLibraryV2(f.jurisdictions,f.records,['JP']);
 assert.equal(snapshot.jurisdictions.length,1);
 assert.equal(snapshot.records[0].review_status,'blocked');
 assert.equal(snapshot.records[0].procedures.length,0);
 const invalid=project();invalid.records[0].review_status='blocked';
 assert.ok(validatePublicTravelLibrary(invalid).some(e=>/blocked/.test(e)));
});

test('only actually supporting ok sources are included',()=>{
 const f=fixture();f.records[0].sources.push({...f.records[0].sources[0],id:'jp-background',access_status:'failed'});
 f.records[0].procedures[0].source_ids.push('jp-background');
 const snapshot=projectPublicTravelLibraryV2(f.jurisdictions,f.records,['JP']);
 assert.deepEqual(snapshot.records[0].procedures[0].source_ids,['jp-source']);
 assert.deepEqual(snapshot.records[0].sources.map(s=>s.id),['jp-source']);
});

test('research execution text withholds a complete procedure instead of silently rewriting facts',()=>{
 for(const text of ['source-cache/JP/form.txt','/Volumes/ExternalPrivate/research','curl returned 403','GLM OCR transcription','rollout-2026-09.jsonl','SHA-256']) {
  const f=fixture();f.records[0].procedures[0].applicability_en += ' '+text;
  const original=f.records[0].procedures[0].applicability_en;
  const snapshot=projectPublicTravelLibraryV2(f.jurisdictions,f.records,['JP']);
  assert.equal(snapshot.records[0].procedures.length,0,text);
  assert.equal(snapshot.records[0].coverage.withheld_procedures,1);
  assert.equal(f.records[0].procedures[0].applicability_en,original);
 }
 assert.equal(PRIVATE_RESEARCH_TEXT.test('raw material and a nationwide rollout of government forms'),false);
 const f=fixture();f.records[0].sources[0].title += ' source-cache/JP/source.txt';
 assert.equal(projectPublicTravelLibraryV2(f.jurisdictions,f.records,['JP']).records[0].procedures.length,0);
});

test('v2 rejects unknown fields, invalid common procedure contracts, coverage/status inflation and stale translations',()=>{
 const cases=[
  s=>s.records[0].unresolved=[],
  s=>s.records[0].sources[0].evidence_excerpt='private',
  s=>s.records[0].coverage.extra=1,
  s=>s.records[0].coverage.published_procedures=2,
  s=>s.records[0].coverage.withheld_procedures=1,
  s=>s.records[0].coverage.open_questions=-1,
  s=>s.records[0].review_status='verified',
  s=>s.records[0].procedures[0].verified_at=null,
  s=>s.records[0].procedures[0].channel='unknown',
  s=>s.records[0].procedures[0].official_url='javascript:alert(1)',
  s=>s.records[0].procedures[0].source_ids=['missing'],
  s=>s.records[0].procedures[0].applicability_zh_hant='stale',
  s=>s.jurisdictions[0].name_zh_hant='stale',
  s=>s.records[0].procedures[0].fee={amount:0,currency:'JPY',note:'source-cache/JP/form.txt'},
  s=>s.records=[],
  s=>s.jurisdictions.push(s.jurisdictions[0]),
 ];
 for(const mutate of cases){const snapshot=project();mutate(snapshot);assert.ok(validatePublicTravelLibrary(snapshot).length>0,mutate.toString());}
});

test('the checked-in global snapshot has one record per destination, consistent counters and no private text',()=>{
 const snapshot=JSON.parse(readFileSync(new URL('../data/travel_library_public.json',import.meta.url),'utf8'));
 assert.equal(snapshot.jurisdictions.length,249);
 assert.equal(snapshot.records.length,249);
 assert.equal(new Set(snapshot.jurisdictions.map(j=>j.id)).size,249);
 assert.equal(new Set(snapshot.records.map(r=>r.jurisdiction_id)).size,249);
 assert.deepEqual(validatePublicTravelLibrary(snapshot),[]);
 assert.equal(snapshot.records.filter(r=>r.review_status==='blocked').every(r=>r.procedures.length===0),true);
 assert.equal(snapshot.records.reduce((sum,r)=>sum+r.coverage.total_procedures,0),394);
 assert.equal(snapshot.records.reduce((sum,r)=>sum+r.procedures.length,0),328);
 assert.equal(snapshot.records.reduce((sum,r)=>sum+r.coverage.withheld_procedures,0),66);
 assert.equal(snapshot.records.reduce((sum,r)=>sum+r.coverage.open_questions,0),531);
 assert.equal(PRIVATE_RESEARCH_TEXT.test(JSON.stringify(snapshot)),false);
});
