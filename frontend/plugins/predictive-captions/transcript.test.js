import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { cleanTranscript, hasAudioSignal } from './transcript.js';
test('reject decoder loops while preserving normal speech and short repetitions',()=>{
 assert.equal(cleanTranscript('嗯'.repeat(30)),'');
 assert.equal(cleanTranscript('谢谢。'.repeat(10)),'');
 assert.equal(cleanTranscript('不，不，不是这个意思。'),'不，不，不是这个意思。');
 assert.equal(cleanTranscript('你好，今天测试语音识别。'),'你好，今天测试语音识别。');
});
test('reject silence, DC offset and low-level noise before inference',()=>{
 assert.equal(hasAudioSignal(new Float32Array(16000)),false);
 assert.equal(hasAudioSignal(new Float32Array(16000).fill(.1)),false);
 assert.equal(hasAudioSignal(Float32Array.from({length:16000},(_,i)=>.002*Math.sin(i))),false);
});
test('worklet does not submit silence, DC, quiet noise or clicks; speech submits',()=>{
 let Recorder; const sent=[];
 vm.runInNewContext(readFileSync(new URL('./recorder.js',import.meta.url),'utf8'),{
  AudioWorkletProcessor:class{port={postMessage:x=>sent.push(x)};},sampleRate:16000,
  registerProcessor:(_,value)=>{Recorder=value;},Float32Array,
 });
 const r=new Recorder();
 const feed=(seconds,fn)=>{for(let i=0;i<Math.ceil(seconds*16000/128);i++)r.process([[Float32Array.from({length:128},(_,j)=>fn(i*128+j))]]);};
 feed(2,()=>0);feed(2,()=>.1);feed(2,i=>.002*Math.sin(i));
 feed(.016,i=>.1*Math.sin(i));feed(1,()=>0);
 assert.equal(sent.length,0);
 feed(1,i=>.1*Math.sin(i*.1));feed(1,()=>0);
 assert.equal(sent.length,1);
});
