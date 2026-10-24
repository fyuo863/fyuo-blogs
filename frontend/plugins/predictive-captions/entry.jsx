import { useEffect, useRef, useState } from 'react';
import { LocalPredictor } from './predictor';
import { createPrediction, judgePrediction } from './prediction';
import './style.css';

const base = new URL('.', import.meta.url);
export default function PredictiveCaptions() {
  const [source, setSource] = useState('microphone');
  const [language, setLanguage] = useState('zh-CN');
  const [phase, setPhase] = useState('idle');
  const [status, setStatus] = useState('模型尚未加载');
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [guess, setGuess] = useState('');
  const [wrong, setWrong] = useState(false);
  const [elapsed, setElapsed] = useState(null);
  const engine = useRef(null);
  const session = useRef({ active: false, generation: 0, text: '', prediction: null, queue: [], busy: false, timer: null });
  const viewport = useRef(null);
  const predictor = useRef(new LocalPredictor('zh-CN'));
  function release() {
    const s = session.current;
    s.active = false;
    s.stream?.getTracks().forEach(track => track.stop());
    s.node?.disconnect(); s.input?.disconnect();
    if (s.context && s.context.state !== 'closed') void s.context.close();
    s.stream = s.node = s.input = s.context = null;
  }
  function stop() {
    const s = session.current;
    s.generation++; release(); s.queue = []; s.busy = false;
    clearTimeout(s.timer); engine.current?.terminate(); engine.current = null;
    setGuess(''); setWrong(false); setPhase('idle'); setStatus('已停止');
  }
  function show(chunk) {
    const s = session.current;
    // Recognition hypotheses are not scored. Each returned segment is committed once.
    const segments = language.startsWith('zh') ? [...chunk] : (chunk.match(/\s*\S+/gu) || []);
    const generation = s.generation;
    const tick = () => {
      if (generation !== s.generation) return;
      const unit = segments.shift();
      if (unit === undefined) { predictor.current.learn(chunk); s.busy = false; pump(); return; }
      const separator = !language.startsWith('zh') && s.text && !/^\s/.test(unit) ? ' ' : '';
      const next = s.text + separator + unit;
      const verdict = judgePrediction(s.prediction, next, true);
      const commit = () => {
        if (generation !== s.generation) return;
        s.text = next.slice(-4000); setText(s.text); setWrong(false);
        s.prediction = createPrediction(s.text, predictor.current.next(s.text), language);
        setGuess(s.prediction?.text || '');
        s.timer = setTimeout(tick, language.startsWith('zh') ? 85 : 150);
      };
      if (verdict.state === 'wrong') { setWrong(true); s.timer = setTimeout(commit, 320); }
      else commit();
    };
    tick();
  }
  function pump() {
    const s = session.current;
    if (s.busy || !s.active || !s.queue.length) return;
    s.busy = true;
    const pcm = s.queue.shift();
    s.inferenceGeneration = s.generation;
    engine.current.postMessage({ type: 'audio', pcm, language }, [pcm.buffer]);
  }
  function load() {
    setError(''); setPhase('loading'); setStatus('准备下载本地模型…');
    const worker = new Worker(new URL('asr-worker.js', base), { type: 'module' });
    engine.current = worker;
    worker.onerror = () => { release(); worker.terminate(); engine.current = null; setPhase('idle'); setError('推理引擎启动失败，请使用新版 Chrome 或 Edge。'); };
    worker.onmessage = ({ data }) => {
      if (engine.current !== worker) return;
      if (data.type === 'progress') setStatus(`下载模型 ${data.progress}% · ${data.file}`);
      if (data.type === 'ready') { setPhase('ready'); setStatus('模型已就绪'); }
      if (data.type === 'text') {
        if (session.current.inferenceGeneration !== session.current.generation) { session.current.busy = false; pump(); return; }
        setElapsed(data.elapsed); setStatus(data.filtered ? '未检测到可靠语音，继续聆听' : '正在聆听'); show(data.text);
      }
      if (data.type === 'error') {
        release(); session.current.generation++; session.current.busy = false;
        worker.terminate(); engine.current = null; setPhase('idle');
        setError(`本地识别失败：${data.message}`); setStatus('已停止');
      }
    };
    worker.postMessage({ type: 'load', base: base.href });
  }
  async function start() {
    setError(''); setPhase('starting');
    const s = session.current;
    const generation = ++s.generation;
    s.active = true; s.queue = []; s.busy = false;
    s.text = ''; s.prediction = null; setText(''); setGuess(''); setWrong(false);
    predictor.current = new LocalPredictor(language);
    try {
      if (!navigator.mediaDevices) throw new Error('请使用 HTTPS 或 localhost 打开页面。');
      if (source === 'microphone' && document.permissionsPolicy?.allowsFeature('microphone') === false) throw new Error('网站尚未为本页面开放麦克风权限，请按插件说明配置后刷新。');
      const stream = source === 'microphone'
        ? await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation:true, noiseSuppression:true, autoGainControl:false, channelCount:1 }, video: false })
        : await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      if (generation !== s.generation) { stream.getTracks().forEach(track => track.stop()); return; }
      s.stream = stream;
      if (!stream.getAudioTracks().length) throw new Error('未共享音频。请选择有声音的标签页，并勾选“分享标签页音频”。');
      stream.getTracks().forEach(track => { track.onended = () => { if (s.active) stop(); }; });
      const context = new AudioContext({ sampleRate: 16000 }); s.context = context;
      await context.audioWorklet.addModule(new URL('recorder.js', base));
      if (generation !== s.generation) return;
      if (context.sampleRate !== 16000) throw new Error('浏览器不支持 16 kHz 音频采集。');
      await context.resume();
      const input = context.createMediaStreamSource(new MediaStream(stream.getAudioTracks()));
      const node = new AudioWorkletNode(context, 'caption-recorder');
      s.input = input; s.node = node;
      node.port.onmessage = ({ data }) => {
        if (!s.active || generation !== s.generation) return;
        if (s.queue.length >= 2) { stop(); setError('设备处理速度跟不上音频，已停止。请缩短讲话或改用性能更好的设备。'); return; }
        s.queue.push(data); pump();
      };
      const muted = context.createGain(); muted.gain.value = 0;
      input.connect(node); node.connect(muted); muted.connect(context.destination);
      setPhase('listening'); setStatus('正在聆听');
    } catch (e) {
      if (generation !== s.generation) return;
      stop(); setError(e.name === 'NotAllowedError' ? '未获得音频权限，请允许访问后重试。' : e.message);
    }
  }
  useEffect(() => () => {
    session.current.generation++;
    clearTimeout(session.current.timer); release(); engine.current?.terminate(); engine.current = null;
  }, []);
  useEffect(() => { if (viewport.current) viewport.current.scrollTop = viewport.current.scrollHeight; }, [text]);
  const running = phase === 'listening' || phase === 'starting';
  return <section className="pc-page" aria-label="预测字幕">
    <header className="pc-header"><h1>字幕。</h1><span>本地运行</span></header>
    <div className="pc-controls">
      <label>音源<select value={source} disabled={running || phase === 'loading'} onChange={e => setSource(e.target.value)}><option value="microphone">麦克风</option><option value="tab">标签页 / 屏幕音频</option></select></label>
      <label>语言<select value={language} disabled={phase !== 'idle'} onChange={e => setLanguage(e.target.value)}><option value="zh-CN">中文</option><option value="en-US">English</option></select></label>
      {phase === 'idle' || phase === 'loading' ? <button className="pc-primary" disabled={phase === 'loading'} onClick={load}>{phase === 'loading' ? '正在加载…' : '加载模型'}</button> : <button className="pc-primary" onClick={running ? stop : start}>{running ? '停止' : '开始'}</button>}
    </div>
    <p className="pc-status" role="status">{status}{elapsed !== null && ` · 上段识别 ${(elapsed / 1000).toFixed(1)} 秒`}</p>
    {error && <p className="pc-error" role="alert">{error}</p>}
    <div className="pc-caption" ref={viewport} aria-label="字幕内容" aria-live="off">
      {!text && !guess ? <span className="pc-placeholder">{running ? '说点什么。' : '声音，在这里变成文字。'}</span> : <><span>{text}</span>{guess && <span className={`pc-guess${wrong ? ' pc-wrong' : ''}`} aria-label={wrong ? '预测错误' : '预测'}>{language === 'en-US' ? ' ' : ''}{guess}</span>}</>}
    </div>
    <footer className="pc-footer"><span>灰色是预测 · 红色表示修正</span><span>Whisper base · 统计预测</span></footer>
    <details><summary>使用说明</summary><p>首次下载语音模型，音频只在此浏览器内处理。按短片段识别后逐字显示，并非零延迟；预测仅使用已显示的文字，未知上下文时不预测。停止会舍弃尚未显示的音频片段。</p><p>共享音频推荐桌面 Chrome / Edge，并勾选“分享标签页音频”。浏览器可能清理模型缓存；首次加载和缓存被清理后需要联网下载。</p></details>
  </section>;
}
