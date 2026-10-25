import {test,expect} from '@playwright/test';

test('inline plugin navigates to one independent instance after the live transition',async({page})=>{
 await page.route('**/api/v1/plugins',r=>r.fulfill({json:{data:[{slug:'capture-test',name:'Capture'}]}}));
 await page.route('**/api/v1/plugins/capture-test/manifest',r=>r.fulfill({json:{data:{id:'capture-test',version:'1.0.0',type:'module',apiVersion:1,entry:'entry.js'}}}));
 await page.route('**/plugin-assets/capture-test/**',r=>r.fulfill({contentType:'text/javascript',body:`const R=globalThis.__FYUO_PLUGIN_HOST_V1__.react; export default function Test(){R.useEffect(()=>{window.captureMounts=(window.captureMounts||0)+1;window.captureActive=(window.captureActive||0)+1;return()=>{window.captureActive-=1;};},[]);return R.createElement('h1',null,'Single plugin instance');}`}));
 await page.goto('/plugins');await expect(page.getByRole('heading',{name:'Single plugin instance'})).toBeVisible();expect(await page.evaluate(()=>window.captureMounts)).toBe(1);
 await page.getByRole('link',{name:/Capture/}).click();
 await expect(page.getByRole('heading',{name:'Single plugin instance'})).toBeVisible();
 await expect(page.locator('.route-live-layer.is-outgoing')).toHaveCount(0);
 await expect.poll(()=>page.evaluate(()=>window.captureActive)).toBe(1);
 await expect(page.locator('.route-live-layer.is-current h1')).toHaveCount(1);
 await expect(page.locator('iframe')).toHaveCount(0);await expect(page.locator('.plugin-sidebar')).toHaveCount(0);
});
