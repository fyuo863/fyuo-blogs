import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseShowcase,showcaseURL} from './catalog.js';
const source=showcaseURL({repository:'someone/showcase',branch:'main',path:'showcase.json'});
const album={id:'demo',title:'Demo',cover:'./covers/demo.svg',content:'Hello',url:'https://github.com/someone/demo'};
test('repository source and relative covers resolve without API keys',()=>{
 assert.equal(source,'https://raw.githubusercontent.com/someone/showcase/main/showcase.json');
 assert.equal(parseShowcase({version:1,albums:[album]},source)[0].image,'https://raw.githubusercontent.com/someone/showcase/main/covers/demo.svg');
 assert.equal(showcaseURL({repository:''}),null);
});
test('reject unsafe URLs, invalid schema and duplicate ids; preserve intentional empty catalogue',()=>{
 for(const url of ['javascript:alert(1)','http://insecure.example','https://user:password@example.com']) assert.throws(()=>parseShowcase({version:1,albums:[{...album,url}]},source));
 assert.throws(()=>parseShowcase({version:1,albums:[album,album]},source));
 assert.throws(()=>parseShowcase({version:2,albums:[]},source));
 assert.deepEqual(parseShowcase({version:1,albums:[]},source),[]);
});

test("display ids accept repository-style capitalization",()=>{
 assert.equal(parseShowcase({version:1,albums:[{...album,id:"GeeMem"}]},source)[0].id,"GeeMem");
});
