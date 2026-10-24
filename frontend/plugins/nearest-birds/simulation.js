export const COUNT = 500;
export const BOIDS = Object.freeze({radius:120,separationRadius:26,minSpeed:64,maxSpeed:170,maxForce:110,maxAcceleration:200,separation:1.7,alignment:1,cohesion:.65,predatorRadius:180,escapeAcceleration:480});
const wrap = value => ((value % 1) + 1) % 1;
const delta = value => value-Math.round(value);
const limit = (x,y,max) => {const length=Math.hypot(x,y);return length>max?[x*max/length,y*max/length]:[x,y];};
export function createBirds(random = Math.random) {
 return Array.from({length:COUNT},()=>({x:random(),y:random(),angle:random()*Math.PI*2,speed:70+random()*90}));
}
export function boidAcceleration(birds,index,width,height,settings=BOIDS,predator=null){
 const bird=birds[index],vx=Math.cos(bird.angle)*bird.speed,vy=Math.sin(bird.angle)*bird.speed;
 let neighbors=0,close=0,ax=0,ay=0,cx=0,cy=0,sx=0,sy=0;
 for(let j=0;j<birds.length;j++){
  if(j===index)continue;
  const other=birds[j];
  const dx=delta(other.x-bird.x)*width,dy=delta(other.y-bird.y)*height,d2=dx*dx+dy*dy;
  if(d2>settings.radius**2)continue;
  neighbors++;ax+=Math.cos(other.angle)*other.speed;ay+=Math.sin(other.angle)*other.speed;
  // Average wrapped offsets, not absolute coordinates, across screen seams.
  cx+=dx;cy+=dy;
  if(d2<settings.separationRadius**2){
   close++;
   if(d2<1e-10){const angle=(index+j)*2.3999632297,sign=index<j?1:-1;sx+=Math.cos(angle)*sign;sy+=Math.sin(angle)*sign;}
   else {sx-=dx/d2;sy-=dy/d2;}
  }
 }
 function steer(x,y){const length=Math.hypot(x,y);return length<1e-10?[0,0]:limit(x/length*settings.maxSpeed-vx,y/length*settings.maxSpeed-vy,settings.maxForce);}
 const separation=close?steer(sx/close,sy/close):[0,0];
 // Match the neighbors' average velocity, including speed.
 const alignment=neighbors?limit(ax/neighbors-vx,ay/neighbors-vy,settings.maxForce):[0,0];
 const cohesion=neighbors?steer(cx/neighbors,cy/neighbors):[0,0];
 const flock=limit(separation[0]*settings.separation+alignment[0]*settings.alignment+cohesion[0]*settings.cohesion,separation[1]*settings.separation+alignment[1]*settings.alignment+cohesion[1]*settings.cohesion,settings.maxAcceleration);
 if(!predator)return flock;
 let dx=delta(bird.x-predator.x)*width,dy=delta(bird.y-predator.y)*height;
 const distance=Math.hypot(dx,dy);
 if(distance>=settings.predatorRadius)return flock;
 if(distance<1e-8){dx=Math.cos(bird.angle);dy=Math.sin(bird.angle);}
 else {dx/=distance;dy/=distance;}
 const threat=1-distance/settings.predatorRadius;
 const escape=limit((dx*settings.maxSpeed-vx)*3,(dy*settings.maxSpeed-vy)*3,settings.escapeAcceleration);
 // Fear overrides flock steering near the predator, blending out at the radius.
 return limit(flock[0]*(1-threat)+escape[0]*threat,flock[1]*(1-threat)+escape[1]*threat,settings.escapeAcceleration);
}
export function stepBirds(birds,dt,width,height,settings=BOIDS, predator=null){
 return birds.map((bird,i)=>{
  const [ax,ay]=boidAcceleration(birds,i,width,height,settings,predator);
  const vx=Math.cos(bird.angle)*bird.speed+ax*dt,vy=Math.sin(bird.angle)*bird.speed+ay*dt;
  const magnitude=Math.hypot(vx,vy),angle=magnitude>1e-10?Math.atan2(vy,vx):bird.angle;
  const speed=Math.max(settings.minSpeed,Math.min(settings.maxSpeed,magnitude));
  return {angle,speed,x:wrap(bird.x+Math.cos(angle)*speed*dt/width),y:wrap(bird.y+Math.sin(angle)*speed*dt/height)};
 });
}
