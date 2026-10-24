import {test} from 'node:test';
import assert from 'node:assert/strict';
import {BOIDS,createBirds,boidAcceleration,stepBirds} from './simulation.js';
const bird=(x,y,angle=0,speed=50)=>({x,y,angle,speed});
const only=rule=>({...BOIDS,separation:0,alignment:0,cohesion:0,[rule]:1});
test('500 birds; isolated bird continues straight',()=>{
 assert.equal(createBirds().length,500);
 assert.deepEqual(boidAcceleration([bird(.5,.5)],0,1000,800),[0,0]);
});
test('separation steers away from nearby birds',()=>assert.ok(boidAcceleration([bird(.5,.5),bird(.51,.5)],0,1000,800,only('separation'))[0]<0));
test('alignment uses all neighbors rather than just the closest',()=>{
 const result=boidAcceleration([bird(.5,.5),bird(.52,.5,Math.PI/2),bird(.56,.5,-Math.PI/2)],0,1000,800,only('alignment'));
 assert.ok(Math.abs(result[1])<1e-9);assert.ok(result[0]<0);
});
test('cohesion follows the short path across both periodic seams',()=>{
 const result=boidAcceleration([bird(.99,.99),bird(.01,.01)],0,1000,800,only('cohesion'));
 assert.ok(result[0]>0&&result[1]>0);
});
test('out-of-range birds exert no force',()=>assert.deepEqual(boidAcceleration([bird(.1,.1),bird(.6,.6)],0,1000,800),[0,0]));
test('simultaneous updates preserve input and wrap positions',()=>{
 const birds=[bird(.99,.99,Math.PI/4,80)],before=structuredClone(birds);
 const next=stepBirds(birds,.1,100,100)[0];assert.deepEqual(birds,before);assert.ok(next.x<.1&&next.y<.1);
});
test('overlaps stay finite and acceleration is bounded',()=>{
 const birds=[bird(.5,.5),bird(.5,.5)];
 const force=boidAcceleration(birds,0,1000,800);assert.ok(Math.hypot(...force)<=BOIDS.maxAcceleration+1e-9);
 for(const next of stepBirds(birds,1/60,1000,800)){assert.ok(Number.isFinite(next.angle));assert.ok(next.speed>=BOIDS.minSpeed&&next.speed<=BOIDS.maxSpeed);}
});

test('predator repels instead of aligning and leaves real bird count unchanged',()=>{
 const birds=[bird(.5,.5,Math.PI/2)],predator={x:.51,y:.5};
 const force=boidAcceleration(birds,0,1000,800,BOIDS,predator);
 assert.ok(force[0]<0);
 const next=stepBirds(birds,1/60,1000,800,BOIDS,predator);
 assert.equal(next.length,1);assert.ok(next[0].x<birds[0].x);
 assert.deepEqual(predator,{x:.51,y:.5});
});
test('predator uses toroidal distance and has no effect outside its radius',()=>{
 const birds=[bird(.99,.5,Math.PI/2)];
 assert.ok(boidAcceleration(birds,0,1000,800,BOIDS,{x:.01,y:.5})[0]<0);
 assert.deepEqual(boidAcceleration(birds,0,1000,800,BOIDS,{x:.5,y:.5}),boidAcceleration(birds,0,1000,800));
 assert.ok(boidAcceleration(birds,0,1000,800,BOIDS,{x:.99,y:.5}).every(Number.isFinite));
});
