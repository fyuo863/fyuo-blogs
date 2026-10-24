import { test, expect } from '@playwright/test';
import { mockBusinessAPI } from './plugin-fixtures.mjs';

test('fixed home and blog work without installed plugins', async ({ page }) => {
  await mockBusinessAPI(page);
  await page.route('https://raw.githubusercontent.com/**', r => r.abort());
  await page.route('**/api/v1/plugins', r => r.fulfill({json:{data:[]}}));
  const manifests=[];page.on('request',r=>{if(r.url().includes('/manifest'))manifests.push(r.url());});
  await page.goto('/');
  await expect(page.locator('#studio-title')).toBeVisible();
  await page.getByRole('navigation',{name:'主导航'}).getByRole('link',{name:/JOURNAL/}).click();
  await expect(page.locator('.blog-title')).toBeVisible();
  await expect(page.getByRole('button',{name:'Migration fixture',exact:true})).toBeVisible();
  await page.goto('/plugins');
  await expect(page.getByRole('status')).toContainText('暂未发布插件');
  expect(manifests).toEqual([]);
});

test('plugin ordering cannot replace home; custom plugin loads on its own route',async({page})=>{
  await mockBusinessAPI(page);
  await page.route('**/api/v1/plugins',r=>r.fulfill({json:{data:[{slug:'custom-page',name:'Custom'}]}}));
  await page.route('**/api/v1/plugins/custom-page/manifest',r=>r.fulfill({json:{data:{id:'custom-page',version:'1.0.0',type:'module',apiVersion:1,entry:'entry.js'}}}));
  await page.route('**/plugin-assets/custom-page/**',r=>r.fulfill({contentType:'text/javascript',body:'export default function Page(){return globalThis.__FYUO_PLUGIN_HOST_V1__.react.createElement("h1",null,"Independent page");}'}));
  await page.goto('/');await expect(page.locator('#studio-title')).toBeVisible();
  await page.goto('/plugins');await page.getByRole('link',{name:/Custom/}).click();
  await expect(page.getByRole('heading',{name:'Independent page'})).toBeVisible();
  await page.reload();await expect(page.getByRole('heading',{name:'Independent page'})).toBeVisible();
});

test('catalog failure can retry independently of fixed pages',async({page})=>{
  await mockBusinessAPI(page);let failed=true;
  await page.route('**/api/v1/plugins',r=>failed?r.fulfill({status:503}):r.fulfill({json:{data:[]}}));
  await page.goto('/plugins');await expect(page.getByRole('alert')).toHaveText('无法加载插件列表');
  failed=false;await page.getByRole('button',{name:'重试'}).click();
  await expect(page.getByRole('status')).toContainText('暂未发布插件');
  await page.getByRole('button',{name:'log-in.',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'log-in.'})).toBeVisible();
});
