import { useEffect, useState } from 'react';
import { parseFeatured, parseShowcase, showcaseURL } from './catalog';
import { resolveReadmeCovers } from './readme';
import defaultConfig from '../../plugins/index/showcase.config.json';

export function useShowcase(config = defaultConfig) {
  const [albums,setAlbums] = useState(null);
  const [featured,setFeatured] = useState(undefined);
  const [error,setError] = useState('');
  useEffect(()=>{
    if (!config.repository) return;
    const coverCache = new Map();
    let stopped=false, busy=false, controller;
    const load=async()=>{
      if (busy || stopped || document.visibilityState==='hidden') return;
      busy=true;controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),12000);
      try {
        const url=showcaseURL(config);
        const response=await fetch(url,{signal:controller.signal,cache:'no-cache',credentials:'omit'});
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text=await response.text();
        if (text.length>512*1024) throw new Error('展示文件过大');
        const data=JSON.parse(text);
        const parsedAlbums=parseShowcase(data,url);
        const parsedFeatured=parseFeatured(data,url);
        const resolved=await resolveReadmeCovers([...parsedAlbums,...(parsedFeatured ? [parsedFeatured] : [])],controller.signal,coverCache);
        if(!stopped){setAlbums(resolved.slice(0,parsedAlbums.length));setFeatured(parsedFeatured ? resolved.at(-1) : parsedFeatured);setError('');}
      } catch { if(!stopped) setError('展示仓库暂时无法读取，暂时显示已有内容。'); }
      finally {clearTimeout(timeout);busy=false;}
    };
    void load();
    const timer=setInterval(load,Math.max(60,Math.min(3600,Number(config.refreshSeconds)||60))*1000);
    document.addEventListener('visibilitychange',load);
    return ()=>{stopped=true;clearInterval(timer);controller?.abort();document.removeEventListener('visibilitychange',load);};
  },[config]);
  return {albums,featured,error,configured:Boolean(config.repository)};
}
