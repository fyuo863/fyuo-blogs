import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { test, expect } from '@playwright/test';
import { mockBusinessAPI } from './plugin-fixtures.mjs';

test.beforeAll(() => { execFileSync(process.execPath,['scripts/build-plugin-architecture.mjs'],{stdio:'pipe'}); });
test('real architecture package loads in host, responds to touch/keyboard and shows actual publication date',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await mockBusinessAPI(page);
  const id='plugin-architecture';
  const manifest=JSON.parse(await readFile(`plugin-dist/${id}/manifest.json`,'utf8'));
  await page.route('**/api/v1/plugins',r=>r.fulfill({json:{data:[{slug:id,name:'快闪架构',active_version:manifest.version,published_at:'2026-10-26T03:00:00Z'}]}}));
  await page.route(`**/api/v1/plugins/${id}/manifest`,r=>r.fulfill({json:{data:manifest}}));
  await page.route(`**/plugin-assets/${id}/**`,async r=>{
    const name=new URL(r.request().url()).pathname.split('/').at(-1);
    if(!['entry.js','style.css'].includes(name))return r.fulfill({status:404});
    await r.fulfill({body:await readFile(`plugin-dist/${id}/${name}`),contentType:name.endsWith('.css')?'text/css':'text/javascript'});
  });
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/plugins');
  await expect(page.locator('.studio-plugin-card__heading time')).toHaveText('上线 2026/10/26');
  await page.locator('.par-page').scrollIntoViewIfNeeded();
  await expect(page.locator('.par-detail')).toContainText('固定页面与共享运行时');
  await expect(page.locator('.par-page')).toHaveCSS('border-radius','0px');
  expect(await page.locator('.par-page').evaluate(el=>getComputedStyle(el).backgroundColor!==getComputedStyle(el.closest('.studio-shell')).backgroundColor)).toBe(true);
  expect(await page.locator('.studio-plugin-container').evaluate(el=>parseFloat(getComputedStyle(el).borderRadius))).toBeGreaterThan(0);
  const nav=await page.locator('.studio-nav').evaluate(el=>({color:getComputedStyle(el).color,background:getComputedStyle(el).backgroundColor}));
  for(const width of [320,375,414,768,1440]){
    await page.setViewportSize({width,height:1000});
    // Viewport changes can resolve before responsive layout and fonts settle in CI.
    await expect.poll(()=>page.locator('.par-page').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
    await page.getByRole('button',{name:/^插件 清单/}).click();
    await expect(page.locator('.par-detail')).toContainText('使用沙箱加载');
    await page.getByRole('button',{name:/发布 ZIP/}).focus();await page.keyboard.press('Enter');
    await expect(page.locator('.par-detail')).toContainText('宿主升级不会替换');
    await page.mouse.move(0,0);
    await page.locator('.par-page').screenshot({path:`test-results/architecture-${width}.png`});
  }
  expect(await page.locator('.studio-nav').evaluate(el=>({color:getComputedStyle(el).color,background:getComputedStyle(el).backgroundColor}))).toEqual(nav);
  const appearance=()=>page.locator('.par-page h1,.par-page h1 span,.par-node--plugin').evaluateAll(elements=>elements.map(el=>{
    const style=getComputedStyle(el);return {color:style.color,background:style.backgroundColor,font:style.fontSize,radius:style.borderRadius};
  }));
  const catalog=await appearance();
  await page.goto('/p/plugin-architecture');
  await expect(page.locator('.par-detail')).toContainText('固定页面与共享运行时');
  expect(await appearance()).toEqual(catalog);
  expect(errors).toEqual([]);
});
