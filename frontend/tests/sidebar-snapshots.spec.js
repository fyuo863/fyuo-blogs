import {test,expect} from '@playwright/test';

test('navigation mounts only the addressed plugin without preview instances',async({page})=>{
 await page.route('**/api/v1/plugins',r=>r.fulfill({json:{data:[{slug:'capture-test',name:'Capture'}]}}));
 await page.route('**/api/v1/plugins/capture-test/manifest',r=>r.fulfill({json:{data:{id:'capture-test',version:'1.0.0',type:'module',apiVersion:1,entry:'entry.js'}}}));
 await page.route('**/plugin-assets/capture-test/**',r=>r.fulfill({contentType:'text/javascript',body:`const R=globalThis.__FYUO_PLUGIN_HOST_V1__.react; export default function Test(){R.useEffect(()=>{window.captureMounts=(window.captureMounts||0)+1;},[]);return R.createElement('h1',null,'Single plugin instance');}`}));
 await page.goto('/plugins');expect(await page.evaluate(()=>window.captureMounts||0)).toBe(0);
 await page.getByRole('link',{name:/Capture/}).click();
 await expect(page.getByRole('heading',{name:'Single plugin instance'})).toBeVisible();
 expect(await page.evaluate(()=>window.captureMounts)).toBe(1);
 await expect(page.locator('iframe')).toHaveCount(0);await expect(page.locator('.plugin-sidebar')).toHaveCount(0);
});
