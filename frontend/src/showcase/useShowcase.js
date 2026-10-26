import { useEffect, useState } from 'react';
import { showcaseURL } from './catalog';
import { loadShowcase, readShowcase, refreshInterval } from './cache';
import defaultConfig from './showcase.config.json';

export function useShowcase(config = defaultConfig) {
  let url = null;
  try { url = showcaseURL(config); } catch { /* Surface invalid configuration below. */ }
  const [snapshot, setSnapshot] = useState(() => ({ url, entry: readShowcase(url), error: '' }));
  const current = snapshot.url === url ? snapshot : { entry: readShowcase(url), error: '' };
  useEffect(()=>{
    if (!config.repository) return;
    let stopped=false;
    const interval = refreshInterval(config);
    const load=async()=>{
      if (stopped || document.visibilityState==='hidden') return;
      try {
        if (!url) throw new Error('Invalid configuration');
        const entry = await loadShowcase(url, interval);
        if(!stopped) setSnapshot({url, entry, error:''});
      } catch { if(!stopped) setSnapshot(previous => ({url, entry:previous.url===url ? previous.entry : readShowcase(url), error:'展示仓库暂时无法读取，暂时显示已有内容。'})); }
    };
    void load();
    const timer=setInterval(load,interval);
    document.addEventListener('visibilitychange',load);
    return ()=>{stopped=true;clearInterval(timer);document.removeEventListener('visibilitychange',load);};
  },[url, config]);
  return {albums:current.entry?.albums ?? null,featured:current.entry?.featured,error:current.error,configured:Boolean(config.repository)};
}
