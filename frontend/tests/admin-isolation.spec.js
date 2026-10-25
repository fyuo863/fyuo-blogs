import { test, expect } from '@playwright/test';
import { mockBusinessAPI, user } from './plugin-fixtures.mjs';

async function productionOrigins(page) {
  await page.route(/^https:\/\/(www\.)?fyuoblog\.top\//, async route => {
    const url = new URL(route.request().url());
    const response = await route.fetch({url:`http://127.0.0.1:5177${url.pathname}${url.search}`});
    await route.fulfill({response});
  });
  await mockBusinessAPI(page);
}

test('production public plugins cannot receive persisted administrator credentials', async ({ page }) => {
  await productionOrigins(page);
  await page.addInitScript(profile=>{if(window===window.top)localStorage.setItem('user',JSON.stringify(profile));}, user);
  await page.route('**/api/v1/plugins',route=>route.fulfill({json:{data:[{slug:'probe',name:'Probe'}]}}));
  await page.route('**/api/v1/plugins/probe/manifest',route=>route.fulfill({json:{data:{id:'probe',version:'1',type:'module',apiVersion:1,entry:'entry.js'}}}));
  await page.route('**/plugin-assets/probe/**',route=>route.fulfill({contentType:'text/javascript',body:`export default function Probe(props){return globalThis.__FYUO_PLUGIN_HOST_V1__.react.createElement('output',null,JSON.stringify({user:props.user,stored:localStorage.getItem('user')}));}`}));
  await page.goto('https://fyuoblog.top/p/probe');
  await expect(page.locator('output')).toHaveText('{"user":null,"stored":null}');
  await page.getByRole('button',{name:'log-in.',exact:true}).click();
  await expect(page).toHaveURL('https://www.fyuoblog.top/');
  await expect(page.locator('.studio-wordmark')).toBeVisible();
});

test('admin origin never requests plugin assets or previews, and edits content through v1', async ({ page }) => {
  await productionOrigins(page);
  await page.addInitScript(profile=>sessionStorage.setItem('user',JSON.stringify(profile)),user);
  const assets=[];
  page.on('request',r=>{if(r.url().includes('/plugin-assets/')||r.url().includes('/manifest'))assets.push(r.url());});
  let mutation;
  await page.route('**/api/v1/travel-places',async route=>{
    if(route.request().method()==='POST'){mutation=route.request().postDataJSON();return route.fulfill({status:201,json:{data:{id:2,...mutation}}});}
    return route.fulfill({json:{data:[]}});
  });
  await page.goto('https://www.fyuoblog.top/p/travel?__plugin_preview=1');
  await expect(page.locator('.studio-wordmark')).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('button',{name:'content.',exact:true}).click();
  await page.getByRole('button',{name:'旅行记录',exact:true}).click();
  await page.getByRole('button',{name:'新建',exact:true}).click();
  await page.getByLabel('地点',{exact:true}).fill('Kyoto');
  await page.getByLabel('纬度',{exact:true}).fill('35');
  await page.getByLabel('经度',{exact:true}).fill('135');
  await page.getByRole('button',{name:'保存',exact:true}).click();
  await expect.poll(()=>mutation?.name).toBe('Kyoto');
  expect(mutation.latitude).toBe(35);
  expect(assets).toEqual([]);
  expect(await page.evaluate(()=>localStorage.getItem('user'))).toBe(null);
});

for (const width of [1440, 390]) {
  test(`authenticated content layout and article save at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await productionOrigins(page);
    await page.addInitScript(profile => sessionStorage.setItem('user', JSON.stringify(profile)), user);
    const writes = [];
    page.on('request', request => {
      if (request.method() === 'PUT' && request.url().endsWith('/articles/42')) writes.push(request.postDataJSON());
    });
    await page.goto('https://www.fyuoblog.top/');
    await page.getByRole('button', { name: 'content.', exact: true }).click();
    const row = page.getByRole('button', { name: /Migration fixture/ });
    await expect(row).toBeVisible();
    const bounds = await row.boundingBox();
    expect(bounds.width).toBeGreaterThan(width < 600 ? 300 : 700);
    expect(bounds.height).toBeGreaterThanOrEqual(80);
    await page.screenshot({ path: testInfo.outputPath('content-list.png'), fullPage: true });
    await row.click();
    await expect(page.getByPlaceholder('Article title...')).toBeVisible();
    await expect(page.locator('.article-sheet')).toHaveCSS('position', 'relative');
    await page.getByPlaceholder('Article title...').fill('Updated article');
    await page.getByRole('button', { name: '保存', exact: true }).click();
    await expect.poll(() => writes.length).toBe(1);
    expect(writes[0].title).toBe('Updated article');
    expect(writes[0].content).toContain('Preserved Markdown');
    await row.click();
    await expect(page.getByPlaceholder('Article title...')).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('content-editor.png'), fullPage: true });
    await page.getByRole('button', { name: 'back.', exact: true }).last().click();
    await expect(row).toBeVisible();
    expect(writes).toHaveLength(1);
    expect(await page.locator('.studio-shell').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.getByRole('button', { name: '首页内容', exact: true }).click();
    await expect(page.getByLabel('封面简介', { exact: true })).toBeVisible();
  });
}

for (const width of [390, 1440]) {
  test(`production login uses shared host dialog and opens management at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await productionOrigins(page);
    await page.goto('https://www.fyuoblog.top/');
    await expect(page.getByRole('dialog', { name: 'log-in.' })).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(1);
    await expect(page.getByText('请登录管理中心。', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'content.', exact: true })).toHaveCount(0);
    await expect(page.locator('.studio-shell')).toHaveCSS('background-color', 'rgb(30, 32, 32)');
    await expect(page.locator('.sign-in-modal__masthead')).toHaveCSS('background-color', 'rgb(255, 52, 85)');
    await expect(page.locator('.sign-in-modal__panel')).toHaveCSS('box-shadow', 'none');
    await page.screenshot({ path: info.outputPath('production-login.png'), fullPage: true });
    await page.getByPlaceholder('name-plz').fill('migration-test');
    await page.getByPlaceholder('and-psw').fill('fixture-password');
    await page.getByRole('button', { name: 'UNLOCK THE DESK', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Admin control panel' })).toBeVisible();
    await page.getByRole('button', { name: 'content.', exact: true }).click();
    await expect(page.getByRole('region', { name: '内容编辑' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Migration fixture/ })).toBeVisible();
    await expect(page.locator('.admin-panel__surface')).toHaveCSS('background-color', 'rgb(30, 32, 32)');
    await expect(page.locator('.admin-panel__surface')).toHaveCSS('box-shadow', 'none');
    const activeNav = page.locator(width < 600 ? '.admin-panel__mobile-nav-item.is-active' : '.admin-panel__nav-item.is-active');
    await expect(activeNav).toHaveCSS('background-color', 'rgb(172, 250, 100)');
    await page.screenshot({ path: info.outputPath('production-management.png'), fullPage: true });
    expect(await page.locator('.studio-shell').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.getByRole('button', { name: 'Close admin panel', exact: true }).click();
    await page.getByRole('button', { name: '退出', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'log-in.' })).toBeVisible();
    expect(await page.evaluate(() => sessionStorage.getItem('user'))).toBe(null);
  });
}

// Same fixtures and viewport, independent origins: compare actual rendered pixels,
// not just palette values. Only the page behind the dialogs is neutralized.
for (const width of [390, 768, 1440, 1920]) {
  test(`local and production dialogs render identically at ${width}px`, async ({ browser }, info) => {
    const context = await browser.newContext({ viewport:{ width, height:900 }, reducedMotion:'reduce' });
    const local = await context.newPage();
    const production = await context.newPage();
    try {
      await mockBusinessAPI(local);
      await productionOrigins(production);
      await local.goto('http://127.0.0.1:5177/');
      await production.goto('https://www.fyuoblog.top/');
      await local.getByRole('button', { name:'log-in.', exact:true }).click();
      const prepare = async page => {
        await page.evaluate(() => document.fonts.ready);
        await page.addStyleTag({ content:'.sign-in-modal,.admin-panel{background:#1e2020!important;backdrop-filter:none!important} *{animation:none!important;transition:none!important}' });
      };
      await prepare(local);
      await prepare(production);
      const compare = async (selector, name) => {
        const expected = local.locator(selector);
        const actual = production.locator(selector);
        await expect(expected).toBeVisible();
        await expect(actual).toBeVisible();
        expect(await actual.boundingBox()).toEqual(await expected.boundingBox());
        const reference = await expected.screenshot({ path:info.outputPath(`local-${name}.png`), animations:'disabled' });
        const deployed = await actual.screenshot({ path:info.outputPath(`production-${name}.png`), animations:'disabled' });
        expect(deployed.equals(reference), `${name} pixels must match the local host`).toBe(true);
      };
      await compare('.sign-in-modal__panel', 'login');
      for (const page of [local, production]) {
        await page.getByPlaceholder('name-plz').fill('migration-test');
        await page.getByPlaceholder('and-psw').fill('fixture-password');
        await page.getByRole('button', {name:'UNLOCK THE DESK',exact:true}).click();
      }
      // Local host keeps success notification and closes dialogs explicitly.
      await local.getByRole('button', {name:'关闭登录窗口',exact:true}).click();
      for (const page of [local, production]) {
        const notification = page.getByRole('button', {name:'close',exact:true});
        if (await notification.isVisible()) await notification.click();
      }
      await local.getByRole('button', {name:'管理后台',exact:true}).click();
      await expect(local.getByText('上传插件',{exact:true})).toBeVisible();
      await expect(production.getByText('上传插件',{exact:true})).toBeVisible();
      await compare('.admin-panel__surface', 'plugins');
      for (const page of [local, production]) await page.getByRole('button', {name:'content.',exact:true}).click();
      await expect(local.getByRole('button',{name:/Migration fixture/})).toBeVisible();
      await expect(production.getByRole('button',{name:/Migration fixture/})).toBeVisible();
      await compare('.admin-panel__surface', 'content');
    } finally { await context.close(); }
  });
}
