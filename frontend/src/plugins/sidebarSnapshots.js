import {useEffect,useState} from 'react';

let captureInFlight=false;

// Capture only the visible reader. Never mount or execute another plugin.
export async function captureReader(reader) {
 const bounds=reader.getBoundingClientRect();
 if(bounds.width<1 || bounds.height<1 || reader.querySelector('iframe'))return null;
 const scale=Math.min(1,320/bounds.width,225/bounds.height);
 const canvas=reader.querySelector('canvas');
 const box=canvas?.getBoundingClientRect();
 // Full-screen canvas plugins (e.g. birds) already have the exact rendered frame.
 if(canvas && box.left<=bounds.left+1 && box.top<=bounds.top+1 && box.right>=bounds.right-1 && box.bottom>=bounds.bottom-1 && reader.querySelectorAll('canvas').length===1 && ![...reader.querySelectorAll('button,a,input,textarea,select')].some(el=>el.getClientRects().length)){
  const output=document.createElement('canvas');
  output.width=Math.max(1,Math.round(bounds.width*scale));output.height=Math.max(1,Math.round(bounds.height*scale));
  const context=output.getContext('2d');
  let background='white';
  for(let parent=canvas;parent&&reader.contains(parent);parent=parent.parentElement){const color=getComputedStyle(parent).backgroundColor;if(color!=='rgba(0, 0, 0, 0)'&&color!=='transparent'){background=color;break;}}
  context.fillStyle=background;context.fillRect(0,0,output.width,output.height);
  context.drawImage(canvas,(bounds.left-box.left)*canvas.width/box.width,(bounds.top-box.top)*canvas.height/box.height,bounds.width*canvas.width/box.width,bounds.height*canvas.height/box.height,0,0,output.width,output.height);
  return output.toDataURL('image/webp',.8);
 }
 const {domToCanvas}=await import('modern-screenshot');
 const output=await domToCanvas(reader,{
  width:bounds.width,height:bounds.height,scale,timeout:1500,
  features:{restoreScrollPosition:true},
  fetch:{requestInit:{credentials:'omit',cache:'force-cache'}},
  filter:node=>!(node instanceof Element)||!node.matches('iframe,script,input,textarea,select,[data-no-snapshot]'),
 });
 return output.toDataURL('image/webp',.8);
}

export function useSidebarSnapshots(readerRef,slug,version,expanded) {
 const [snapshots,setSnapshots]=useState({});
 useEffect(()=>{
  if(!slug)return;
  const key=`${slug}@${version||''}`;
  const reader=readerRef.current;
  if(!reader)return;
  let cancelled=false,timer=0,busy=false,lastCapture=0;
  const schedule=(delay)=>{clearTimeout(timer);timer=window.setTimeout(capture,delay);};
  async function capture(){
   if(cancelled)return;
   if(document.hidden||busy||captureInFlight){schedule(1500);return;}
   busy=true;captureInFlight=true;
   try{
    const image=await captureReader(reader);
    if(!cancelled && reader.isConnected && image){
     setSnapshots(previous=>Object.fromEntries([...Object.entries(previous).filter(([id])=>id!==key).slice(-11),[key,image]]));
    }
   }catch{ /* Retain the last valid frame for tainted or unsupported content. */ }
   finally{busy=false;captureInFlight=false;lastCapture=performance.now();if(!cancelled)schedule(expanded?2000:5000);}
  }
  const refresh=()=>{if(!busy)schedule(Math.max(200,1000-(performance.now()-lastCapture)));};
  reader.addEventListener('scroll',refresh,{passive:true});
  document.addEventListener('visibilitychange',refresh);
  window.addEventListener('resize',refresh);
  schedule(500);
  return()=>{cancelled=true;clearTimeout(timer);reader.removeEventListener('scroll',refresh);document.removeEventListener('visibilitychange',refresh);window.removeEventListener('resize',refresh);};
 },[readerRef,slug,version,expanded]);
 return snapshots;
}
