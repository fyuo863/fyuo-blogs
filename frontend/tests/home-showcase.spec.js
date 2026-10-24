import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const root=new URL('../plugin-dist/index/',import.meta.url);
async function setup(page,showcase){
 await page.route("https://raw.githubusercontent.com/fyuo863/fb-basement/**", route=>showcase ? route.fulfill({json:showcase}) : route.abort());
 const manifest=JSON.parse(await readFile(new URL('manifest.json',root),'utf8'));
 await page.route('**/api/v1/**',route=>route.fulfill({json:{data:route.request().url().endsWith('/manifest')?manifest:route.request().url().endsWith('/plugins')?[{slug:'index',name:'index'}]:null}}));
 await page.route('**/plugin-assets/index/**',async route=>{
  const name=new URL(route.request().url()).pathname.split('/').at(-1);
  const type=name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'image/svg+xml';
  await route.fulfill({body:await readFile(new URL(name,root)),contentType:type});
 });
 await page.route('https://fonts.googleapis.com/**',route=>route.fulfill({contentType:'text/css',body:''}));
 await page.goto('/p/index');
}
for(const width of [1440,390])test(`album flip and navigation ${width}`,async({page},info)=>{
 await page.setViewportSize({width,height:900});await setup(page);
 await expect(page.getByText('fyuo / independent work / issue 01',{exact:true})).toHaveCount(0);
 await expect(page.locator('.project-postcard')).toHaveCount(0);
 const cover=page.getByRole('button',{name:'查看 fyuo-blogs.',exact:true});
 await cover.scrollIntoViewIfNeeded();await cover.click();
 const back=page.getByRole('region',{name:'fyuo-blogs. 详情',exact:true});
 await expect(back).toBeVisible();
 await expect(page.locator('.cover-flow__item[data-flipped=true]')).toHaveCount(1);
 await expect(back.getByRole('link',{name:'打开项目'})).toHaveAttribute('href','https://github.com/fyuo863/fyuo-blogs');
 await page.waitForTimeout(650);
 await page.screenshot({path:info.outputPath('album-back.png')});
 await back.getByRole('button',{name:'返回封面'}).click();
 await expect(cover).toBeFocused();
 await page.getByRole('button',{name:'Next project'}).click();
 await expect(page.locator('.cover-flow__navigation p')).toHaveText('go-file-fetch');
 await page.getByRole('button',{name:'查看 go-file-fetch',exact:true}).click();
 await page.keyboard.press('Escape');
 await expect(page.locator('.cover-flow__item[data-flipped=true]')).toHaveCount(0);
});

test('featured repository content replaces the old card without enabling a link',async({page})=>{
 await setup(page,{version:1,albums:[],featured:{title:'推荐测试',description:'仓库中的推荐内容',url:''}});
 const feature=page.getByRole('region',{name:'Featured project'});
 await expect(feature.getByRole('heading',{name:'推荐测试'})).toBeVisible();
 await expect(feature.getByText('仓库中的推荐内容')).toBeVisible();
 await expect(feature.getByRole('link')).toHaveCount(0);
});

test('ultrawide canvas has a pixel budget and draws once per animation frame',async({page},info)=>{
 await page.setViewportSize({width:3440,height:900});
 await page.addInitScript(()=>{
  window.titleDraws=0;
  const fill=CanvasRenderingContext2D.prototype.fillRect;
  CanvasRenderingContext2D.prototype.fillRect=function(...args){window.titleDraws++;return fill.apply(this,args);};
 });
 await setup(page);
 await page.locator('.halftone-title__canvas').waitFor();
 await page.waitForTimeout(300);
 const result=await page.evaluate(()=>new Promise(resolve=>{
  window.titleDraws=0;
  let frames=0;const start=performance.now();
  const timer=setInterval(()=>window.dispatchEvent(new PointerEvent('pointermove',{clientX:1000,clientY:300})),8);
  function step(time){frames++;if(time-start<1000)requestAnimationFrame(step);else{clearInterval(timer);const c=document.querySelector('.halftone-title__canvas');resolve({frames,draws:window.titleDraws,pixels:c.width*c.height});}}
  requestAnimationFrame(step);
 }));
 expect(result.pixels).toBeLessThanOrEqual(1200000);
 expect(result.draws).toBeGreaterThan(0);
 expect(result.draws).toBeLessThanOrEqual(result.frames+2);
 await page.screenshot({path:info.outputPath('ultrawide-title.png')});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForTimeout(100);
 const before=await page.evaluate(()=>window.titleDraws);
 await page.waitForTimeout(250);
 expect(await page.evaluate(()=>window.titleDraws)).toBe(before);
});
