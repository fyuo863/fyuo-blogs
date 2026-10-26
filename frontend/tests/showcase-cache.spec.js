import { test, expect, webkit } from '@playwright/test';
import { mockBusinessAPI } from './plugin-fixtures.mjs';
const image='https://raw.githubusercontent.com/example/covers/main/cover.svg';
const svg='<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><rect width="320" height="320" fill="#acfa64"/><text x="24" y="180" font-size="48">COVER</text></svg>';
async function setup(page) {
  await mockBusinessAPI(page);
  let sourceCalls=0,imageCalls=0,mode='valid';
  await page.route('https://raw.githubusercontent.com/**',r=>{
    if(r.request().url()===image){imageCalls++;return mode==='offline'?r.abort():r.fulfill({contentType:'image/svg+xml',body:svg});}
    sourceCalls++;
    if(mode==='offline')return r.abort();
    return r.fulfill({json:{version:1,albums:mode==='empty'?[]:Array.from({length:4},(_,i)=>({id:'p'+i,title:'Cached project '+i,cover:image}))}});
  });
  return {counts:()=>({sourceCalls,imageCalls}),mode:value=>{mode=value;}};
}
test('both album rails reuse persisted data and images; refreshes do not resurrect empty content',async({page})=>{
  const state=await setup(page);await page.clock.install();
  await page.goto('/');
  await expect(page.locator('.studio-poster')).toHaveCount(4);
  await expect(page.locator('.studio-poster img').first()).toHaveAttribute('src',/^blob:/);
  await page.locator('.cover-flow__stage').scrollIntoViewIfNeeded();
  await expect(page.locator('.cover-flow__front img').first()).toHaveAttribute('src',/^blob:/);
  await expect.poll(()=>state.counts().imageCalls).toBe(1);
  state.mode('offline');await page.reload();
  await expect(page.locator('.studio-poster')).toHaveCount(4);
  await expect(page.locator('.studio-poster img').first()).toHaveAttribute('src',/^blob:/);
  expect(state.counts()).toEqual({sourceCalls:1,imageCalls:1});
  await page.clock.fastForward(61000);
  await expect(page.locator('.studio-data-note')).toContainText('暂时无法读取');
  await expect(page.locator('.studio-poster')).toHaveCount(4);
  state.mode('empty');await page.clock.fastForward(60000);
  await expect(page.locator('.studio-poster,.cover-flow__item')).toHaveCount(0);
  await page.reload();await expect(page.locator('.studio-poster,.cover-flow__item')).toHaveCount(0);
});
test('WebKit mobile keeps perspective, selecting and flipping albums',async()=>{
  const browser=await webkit.launch();
  try {
    const context=await browser.newContext({viewport:{width:375,height:900},isMobile:true,hasTouch:true});
    const page=await context.newPage();await setup(page);
    await page.goto('http://127.0.0.1:5177/');
    await expect(page.locator('.cover-flow__item')).toHaveCount(4);
    await page.locator('.cover-flow__stage').scrollIntoViewIfNeeded();
    await expect(page.locator('.cover-flow__front img').first()).toHaveAttribute('src',/^blob:/);
    const geometry=await page.locator('.cover-flow__scene').evaluate(el=>{
      const cards=[...el.querySelectorAll('.cover-flow__item')];
      return {perspective:getComputedStyle(el).perspective,style:getComputedStyle(el).transformStyle,front:cards[0].getBoundingClientRect().width,side:cards[1].getBoundingClientRect().width};
    });
    expect(geometry.perspective).not.toBe('none');expect(geometry.style).toBe('preserve-3d');
    expect(geometry.side).toBeLessThan(geometry.front*.65);
    await expect(page.locator('.cover-flow__item[data-active=true] > .cover-flow__sleeve > .cover-flow__back')).toBeHidden();
    await expect(page.locator('.cover-flow__item[data-active=true] > .cover-flow__sleeve > .cover-flow__front')).toBeVisible();
    await page.screenshot({path:'test-results/cover-flow-webkit-mobile.png'});
    const stage=page.locator('.cover-flow__stage');await stage.focus();await page.keyboard.press('ArrowRight');
    await expect(page.locator('.cover-flow__item[data-active=true] .cover-flow__front').first()).toHaveAttribute('aria-label','查看 Cached project 1');
    await page.locator('.cover-flow__item[data-active=true] > .cover-flow__sleeve .cover-flow__front').click();
    await expect(page.locator('.cover-flow__item[data-flipped=true]')).toHaveCount(1);
    await expect(page.locator('.cover-flow__item[data-flipped=true] > .cover-flow__sleeve > .cover-flow__front')).toBeHidden();
    await page.screenshot({path:'test-results/cover-flow-webkit-mobile-back.png'});
    await page.getByRole('region',{name:'Cached project 1 详情',exact:true}).getByRole('button',{name:'返回封面'}).click();
    await expect(page.locator('.cover-flow__item[data-flipped=true]')).toHaveCount(0);
    await context.close();
  } finally { await browser.close(); }
});
