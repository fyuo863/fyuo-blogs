import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadShowcase, readShowcase } from './cache.js';

const source = id => `https://raw.githubusercontent.com/test/${id}/main/showcase.json`;
const payload = title => ({version:1, albums:[{id:'one',title,cover:'https://example.com/cover.png'}]});
const response = data => ({ok:true,text:async()=>JSON.stringify(data)});
test('shares requests, reuses fresh records, preserves good content on failure and accepts empty updates', async () => {
  const url=source('shared'); let calls=0, finish;
  const request=async()=>{calls++;return new Promise(resolve=>{finish=resolve;});};
  const a=loadShowcase(url,60000,request), b=loadShowcase(url,60000,request);
  finish(response(payload('First')));
  assert.equal(await a,await b);assert.equal(calls,1);
  await loadShowcase(url,60000,request);assert.equal(calls,1);
  await assert.rejects(loadShowcase(url,0,async()=>response({version:99})));
  assert.equal(readShowcase(url).albums[0].title,'First');
  await loadShowcase(url,0,async()=>response({version:1,albums:[]}));
  assert.deepEqual(readShowcase(url).albums,[]);
  assert.equal(readShowcase(source('different')),null);
});
test('persisted public data is revalidated, source-specific and expires after seven days', async () => {
  const records=new Map();
  globalThis.localStorage={getItem:key=>records.get(key),setItem:(key,value)=>records.set(key,value),key:index=>[...records.keys()][index],get length(){return records.size;},removeItem:key=>records.delete(key)};
  const url=source('persisted');
  await loadShowcase(url,0,async()=>response(payload('Persisted')));
  assert.equal(JSON.parse([...records.values()][0]).data.albums[0].title,'Persisted');
  const external=source('restored');const key='fyuo-showcase-v1:'+external;
  records.set(key,JSON.stringify({savedAt:Date.now(),data:payload('Restored'),covers:[]}));
  assert.equal(readShowcase(external).albums[0].title,'Restored');
  const expired=source('expired');
  records.set('fyuo-showcase-v1:'+expired,JSON.stringify({savedAt:Date.now()-8*86400000,data:payload('Expired')}));
  assert.equal(readShowcase(expired),null);
  const unsafe=source('unsafe');
  records.set('fyuo-showcase-v1:'+unsafe,JSON.stringify({savedAt:Date.now(),data:{version:1,albums:[{id:'one',title:'Unsafe',cover:'javascript:alert(1)'}]}}));
  assert.equal(readShowcase(unsafe),null);
  delete globalThis.localStorage;
});
