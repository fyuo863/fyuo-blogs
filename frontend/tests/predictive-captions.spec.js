import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const root = new URL('../plugin-dist/predictive-captions/', import.meta.url);
async function serve(context) {
  const manifest = JSON.parse(await readFile(new URL('manifest.json', root), 'utf8'));
  await context.route('**/api/v1/**', route => route.fulfill({json: {data: route.request().url().endsWith('/manifest') ? manifest : [{slug:manifest.id,name:manifest.name}]}}));
  await context.route('**/plugin-assets/predictive-captions/**', async route => {
    const name = new URL(route.request().url()).pathname.split('/').at(-1);
    const types = {js:'text/javascript',mjs:'text/javascript',css:'text/css',json:'application/json',bin:'application/octet-stream'};
    await route.fulfill({body:await readFile(new URL(name,root)),contentType:types[name.split('.').at(-1)]||'text/plain'});
  });
}
test('caption plugin loads without requesting microphone or model on mount', async ({page,context}, info) => {
  await serve(context);
  await page.addInitScript(() => {
    window.permissionRequests = 0;
    navigator.mediaDevices.getUserMedia = async () => { window.permissionRequests++; throw new DOMException('Denied','NotAllowedError'); };
    window.Worker = class {
      postMessage(data) { if(data.type==='load') queueMicrotask(()=>this.onmessage({data:{type:'ready'}})); }
      terminate() { window.workerTerminated = true; }
    };
  });
  await page.goto('/p/predictive-captions');
  await expect(page.getByRole('heading',{name:'字幕。'})).toBeVisible();
  expect(await page.evaluate(()=>window.permissionRequests)).toBe(0);
  await page.getByRole('button',{name:'加载模型',exact:true}).click();
  await page.getByRole('button',{name:'开始',exact:true}).click();
  await expect(page.getByRole('alert')).toContainText('未获得音频权限');
  expect(await page.evaluate(()=>window.workerTerminated)).toBe(true);
  await page.screenshot({path:info.outputPath('desktop.png')});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:info.outputPath('mobile.png')});
  expect(await page.locator('.pc-page').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
});
test('real local Whisper inference in browser', async ({page,context}, info) => {
  test.skip(!process.env.CAPTION_MODEL_TEST, 'Opt-in real model download');
  test.setTimeout(300000);
  await serve(context);
  await page.goto('/p/predictive-captions');
  await context.route('**/caption-fixture.wav', async route => route.fulfill({body:await readFile(new URL('./fixtures/caption-hello.wav',import.meta.url)),contentType:'audio/wav'}));
  await context.route('**/caption-chinese.wav', async route => route.fulfill({body:await readFile(new URL('./fixtures/caption-chinese.wav',import.meta.url)),contentType:'audio/wav'}));
  const infer = (language='en-US') => page.evaluate(async (language) => {
    const worker = new Worker('/plugin-assets/predictive-captions/0.1.1/asr-worker.js',{type:'module'});
    const audio = await (await fetch(language==='zh-CN'?'/caption-chinese.wav':'/caption-fixture.wav')).arrayBuffer();
    const decoded = await new OfflineAudioContext(1,1,16000).decodeAudioData(audio);
    return new Promise(resolve => {
      const timer=setTimeout(()=>{worker.terminate();resolve({error:'model timeout'});},240000);
      worker.onerror=e=>{clearTimeout(timer);worker.terminate();resolve({error:e.message});};
      worker.onmessage=({data})=>{
        if(data.type==='ready') {
          const pcm=decoded.getChannelData(0).slice();
          worker.postMessage({type:'audio',pcm,language},[pcm.buffer]);
        }
        if(data.type==='text'||data.type==='error'){clearTimeout(timer);worker.terminate();resolve(data);}
      };
      worker.postMessage({type:'load',base:new URL('/plugin-assets/predictive-captions/0.1.1/',location.origin).href});
    });
  }, language);
  const result = await infer();
  await context.route(/^https:\/\//, route => route.abort());
  const cached = await infer();
  expect(cached.type,JSON.stringify(cached)).toBe('text');
  expect(cached.text.toLowerCase()).toContain('hello');
  const chinese = await infer('zh-CN');
  await info.attach('chinese-inference.json',{body:JSON.stringify(chinese),contentType:'application/json'});
  expect(chinese.type,JSON.stringify(chinese)).toBe('text');
  expect(chinese.text,JSON.stringify(chinese)).toMatch(/你好/);
  expect(chinese.text,JSON.stringify(chinese)).toMatch(/测试|測試/);
  await info.attach('real-inference.json',{body:JSON.stringify(result),contentType:'application/json'});
  expect(result.type,JSON.stringify(result)).toBe('text');
  expect(result.text.toLowerCase()).toContain('hello');
  expect(result.text.toLowerCase()).toContain('thank you');
});

test('prediction flashes red before correction and stop releases capture', async ({page,context}, info) => {
  await serve(context);
  await page.addInitScript(() => {
    window.releasedTracks = 0;
    const track={stop(){window.releasedTracks++;}};
    navigator.mediaDevices.getUserMedia=async()=>({getTracks:()=>[track],getAudioTracks:()=>[track]});
    window.MediaStream=class {};
    window.AudioContext=class {
      sampleRate=16000;state='running';audioWorklet={addModule:async()=>{}};
      async resume(){} async close(){this.state='closed';window.audioClosed=true;}
      createMediaStreamSource(){return {connect(){},disconnect(){}};}
      createGain(){return {gain:{value:0},connect(){}};}
    };
    window.AudioWorkletNode=class {
      port={};connect(){setTimeout(()=>this.port.onmessage({data:new Float32Array(100)}),30);}disconnect(){}
    };
    window.Worker=class {
      postMessage(data){queueMicrotask(()=>this.onmessage({data:data.type==='load'?{type:'ready'}:{type:'text',text:'今天晚上',elapsed:10}}));}
      terminate(){window.workerTerminated=true;}
    };
  });
  await page.goto('/p/predictive-captions');
  await page.getByRole('button',{name:'加载模型',exact:true}).click();
  await page.getByRole('button',{name:'开始',exact:true}).click();
  await expect(page.locator('.pc-wrong')).toHaveText('的');
  await page.screenshot({path:info.outputPath('prediction-correction.png')});
  await expect(page.locator('.pc-caption')).toContainText('今天晚上');
  await page.getByRole('button',{name:'停止',exact:true}).click();
  expect(await page.evaluate(()=>window.releasedTracks)).toBeGreaterThan(0);
  expect(await page.evaluate(()=>window.audioClosed && window.workerTerminated)).toBe(true);
  await expect(page.locator('.pc-guess')).toHaveCount(0);
});
