import {useEffect,useRef,useState} from 'react';
import {BOIDS,createBirds,stepBirds} from './simulation';
import './style.css';
export default function NearestBirds(){
 const canvasRef=useRef(null);
 const birdsRef=useRef(null);
 const [paused,setPaused]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [generation,setGeneration]=useState(0);
 useEffect(()=>{
  const canvas=canvasRef.current;
  const context=canvas.getContext('2d');
  if(!birdsRef.current) birdsRef.current=createBirds();
  let width=1,height=1,last=0,accumulator=0,frame=0,visible=true;
  const preview=new URLSearchParams(window.location.search).get('__plugin_preview')==='1';
  let lastDraw=0;
  let pointer=null;
  function movePointer(event){
   if(preview || event.pointerType==='touch')return;
   const rect=canvas.getBoundingClientRect();
   const x=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
   const y=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));
   pointer={x,y};
   if(paused)draw();
  }
  function clearPointer(){pointer=null;if(paused)draw();}
  canvas.addEventListener('pointermove',movePointer);
  canvas.addEventListener('pointerleave',clearPointer);
  canvas.addEventListener('pointercancel',clearPointer);
  window.addEventListener('blur',clearPointer);
  function draw(){
   context.clearRect(0,0,width,height);
   context.strokeStyle='#202020';context.lineWidth=1.6;context.lineCap='round';context.lineJoin='round';
   context.beginPath();
   for(const bird of birdsRef.current){
    const x=bird.x*width,y=bird.y*height,c=Math.cos(bird.angle),s=Math.sin(bird.angle);
    // Draw periodic copies so even the glyph crosses a seam continuously.
    for(const dx of [-width,0,width])for(const dy of [-height,0,height]){
     const px=x+dx,py=y+dy;if(px < -10 || px > width+10 || py < -10 || py > height+10)continue;
     context.moveTo(px-5*c-4*s,py-5*s+4*c);
     context.lineTo(px+5*c,py+5*s);
     context.lineTo(px-5*c+4*s,py-5*s-4*c);
    }
   }
   context.stroke();
  }

  function resize(){
   const rect=canvas.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
   const scale=Math.min(devicePixelRatio||1,2,Math.sqrt(2000000/(width*height)));
   canvas.width=Math.max(1,Math.floor(width*scale));canvas.height=Math.max(1,Math.floor(height*scale));
   context.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);draw();
  }
  function tick(time){
   frame=0;if(paused||document.hidden||!visible){last=0;return;}
   accumulator+=last?Math.min((time-last)/1000,.1):0;last=time;
   while(accumulator>=1/60){birdsRef.current=stepBirds(birdsRef.current,1/60,width,height,BOIDS,pointer);accumulator-=1/60;}
   if(time-lastDraw>=1000/(preview?20:60)-.5){draw();lastDraw=time;}
   frame=requestAnimationFrame(tick);
  }
  function resume(){if(!frame&&!paused&&!document.hidden&&visible){last=0;frame=requestAnimationFrame(tick);}}
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resume();});intersection.observe(canvas);
  document.addEventListener('visibilitychange',resume);resize();resume();
  return()=>{canvas.removeEventListener('pointermove',movePointer);canvas.removeEventListener('pointerleave',clearPointer);canvas.removeEventListener('pointercancel',clearPointer);window.removeEventListener('blur',clearPointer);cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',resume);};
 },[paused,generation]);
 return <section className="nearest-birds" aria-label="鸟群模拟">
  <canvas ref={canvasRef} className="nearest-birds__canvas" role="img" aria-label="500 只鸟，使用分离、对齐和聚合规则，四边循环相通，鼠标作为不可见捕食者，附近鸟群会逃离"/>
  <div className="nearest-birds__controls"><span>500 只鸟</span><button onClick={()=>setPaused(value=>!value)}>{paused?'继续':'暂停'}</button><button onClick={()=>{birdsRef.current=createBirds();setGeneration(value=>value+1);}}>重新开始</button></div>
 </section>;
}
