import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readmeImage, resolveReadmeCovers} from './readme.js';
const base='https://raw.githubusercontent.com/user/repo/main/docs/README.md';
test('README images skip badges, resolve relative paths and support HTML and references',()=>{
 assert.equal(readmeImage('![build](https://img.shields.io/build)\n![cover](../cover.png)',base),'https://raw.githubusercontent.com/user/repo/main/cover.png');
 assert.equal(readmeImage('<img src="./art.png">',base),new URL('./art.png',base).href);
 assert.equal(readmeImage('![cover][art]\n[art]: ./art.png',base),new URL('./art.png',base).href);
 assert.equal(readmeImage('![x](javascript:alert)\n![x](https://github.com/u/r/blob/main/a.png)',base),'https://raw.githubusercontent.com/u/r/main/a.png');
 assert.equal(readmeImage('no image',base),'');
});
test('fetch and cache README covers; preserve good cover during API failure',async()=>{
 const albums=[{linkUrl:'https://github.com/user/repo',image:''}];
 const cache=new Map();let calls=0;
 const request=async()=>{calls++;return {ok:true,json:async()=>({encoding:'base64',content:Buffer.from('![cover](./art.png)').toString('base64'),download_url:base})};};
 const first=await resolveReadmeCovers(albums,undefined,cache,request);
 assert.equal(first[0].image,new URL('./art.png',base).href);
 await resolveReadmeCovers(albums,undefined,cache,request);assert.equal(calls,1);
 cache.get('user/repo').expires=0;
 assert.deepEqual(await resolveReadmeCovers(albums,undefined,cache,async()=>{throw Error('rate limit');}),first);
 assert.equal((await resolveReadmeCovers(albums,undefined,new Map(),async()=>({ok:false})))[0].image,'');
});
