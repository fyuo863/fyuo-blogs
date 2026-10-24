import { test, expect } from '@playwright/test';
import { mockBusinessAPI } from './plugin-fixtures.mjs';
for (const width of [320,375,414,768,1440]) {
 test(`studio home fits ${width}px and navigation works`,async({page},info)=>{
  await mockBusinessAPI(page);await page.route('https://raw.githubusercontent.com/**',r=>r.abort());
  await page.setViewportSize({width,height:900});await page.goto('/');
  await expect(page.locator('#studio-title')).toBeVisible();
  expect(await page.locator('.plugin-shell__reader').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
  await page.screenshot({path:info.outputPath(`studio-${width}.png`)});
  await page.getByRole('slider',{name:'横向浏览精选项目'}).fill('700');
  await expect.poll(()=>page.locator('.studio-poster-rail').evaluate(el=>el.scrollLeft)).toBeGreaterThan(20);
  await page.locator('.studio-footer').scrollIntoViewIfNeeded();
  await expect(page.getByRole('link',{name:'浙ICP备2026038123号'})).toBeVisible();
  await page.getByRole('navigation',{name:'主导航'}).getByRole('link',{name:/JOURNAL/}).click();
  await expect(page.locator('.blog-title')).toBeVisible();
  expect(await page.locator('.plugin-shell__reader').evaluate(el=>el.scrollTop)).toBe(0);
 });
}
test('explicit empty showcase and reduced motion are respected',async({page})=>{
 await mockBusinessAPI(page);await page.emulateMedia({reducedMotion:'reduce'});
 await page.route('https://raw.githubusercontent.com/**',r=>r.fulfill({json:{version:1,albums:[]}}));
 await page.goto('/');await expect(page.locator('.studio-empty')).toBeVisible();
 await expect(page.locator('.studio-poster')).toHaveCount(0);
 await expect(page.locator('.studio-keyvisual .halftone-title__canvas')).toBeVisible();
});
