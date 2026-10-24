import { pipeline, env } from '@huggingface/transformers';
import { cleanTranscript, hasAudioSignal } from './transcript.js';
let lastFiller = '';
let transcriber;
let wasmURL;
env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.proxy = false;
self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'load') {
      const base = new URL(data.base);
      const config = await (await fetch(new URL('runtime.json', base))).json();
      const parts = await Promise.all(config.parts.map(async name => {
        const response = await fetch(new URL(name, base));
        if (!response.ok) throw new Error('推理引擎加载失败');
        return response.arrayBuffer();
      }));
      wasmURL = URL.createObjectURL(new Blob(parts, { type: 'application/wasm' }));
      env.backends.onnx.wasm.wasmPaths = { wasm: wasmURL, mjs: new URL(config.module, base).href };
      transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-base', {
        device: 'wasm', dtype: 'q8',
        progress_callback: progress => {
          if (progress.status === 'progress') self.postMessage({ type: 'progress', file: progress.file, progress: Math.round(progress.progress || 0) });
        },
      });
      self.postMessage({ type: 'ready' });
    } else if (data.type === 'audio') {
      if (!transcriber) throw new Error('模型尚未加载');
      if (!hasAudioSignal(data.pcm)) { self.postMessage({type:'text',text:'',elapsed:0,filtered:true}); return; }
      const start = performance.now();
      const result = await transcriber(data.pcm, { language: data.language === 'zh-CN' ? 'chinese' : 'english', task: 'transcribe', max_new_tokens: 96, no_repeat_ngram_size: 3, repetition_penalty: 1.1 });
      let text = cleanTranscript(result.text);
      const filler = text.replace(/[\p{P}\s]/gu, '');
      if (/^[嗯呃啊唔]+$/u.test(filler)) {
        if (lastFiller === filler || filler.length >= 3) text = '';
        lastFiller = filler;
      } else if (text) lastFiller = '';
      self.postMessage({ type: 'text', text, filtered:!text, elapsed: Math.round(performance.now() - start) });
    }
  } catch (error) {
    self.postMessage({ type: 'error', message: String(error.message || error) });
  }
};
