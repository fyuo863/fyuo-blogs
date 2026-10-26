import { test, expect } from '@playwright/test';
import { mockBusinessAPI, user } from './plugin-fixtures.mjs';
import { origins, manager, productionOrigins } from './production-fixtures.mjs';
async function signIn(page) {
  const panel=manager(page);
  await panel.getByPlaceholder('name-plz').fill('migration-test');
  await panel.getByPlaceholder('and-psw').fill('fixture-password');
  await panel.getByRole('button',{name:'UNLOCK THE DESK',exact:true}).click();
  await expect(panel.getByText('logged-in.',{exact:true})).toBeVisible();
  await panel.getByRole('button',{name:'关闭登录窗口',exact:true}).click();
  await expect(page.locator('.remote-management')).toBeHidden();
  await expect(page.getByRole('button',{name:'管理后台',exact:true})).toBeVisible();
}

test('public plugins never receive credentials and stay mounted during login',async({page})=>{
  await productionOrigins(page);
  await page.addInitScript(profile=>{if(window===window.top)localStorage.setItem('user',JSON.stringify(profile));},user);
  await page.route('**/api/v1/plugins/probe/manifest',r=>r.fulfill({json:{data:{id:'probe',version:'1',type:'module',apiVersion:1,entry:'entry.js'}}}));
  await page.route('**/plugin-assets/probe/**',r=>r.fulfill({contentType:'text/javascript',body:`export default function Probe(props){const R=globalThis.__FYUO_PLUGIN_HOST_V1__.react;const [n,setN]=R.useState(0);return R.createElement('button',{onClick:()=>setN(n+1)},JSON.stringify({n,user:props.user,stored:localStorage.getItem('user')}));}`}));
  await page.goto(origins[0]+'/p/probe?keep=1#state');
  const plugin=page.getByRole('button',{name:/"stored":null/});await plugin.click();const url=page.url();
  await page.getByRole('button',{name:'log-in.',exact:true}).click();
  await expect(manager(page).getByRole('dialog',{name:'log-in.'})).toBeVisible();expect(page.url()).toBe(url);
  await signIn(page);
  await expect(plugin).toHaveText('{"n":1,"user":null,"stored":null}');
  expect(await page.evaluate(()=>[localStorage.getItem('user'),sessionStorage.getItem('user')])).toEqual([null,null]);
  await page.evaluate(()=>window.postMessage({channel:'fyuo-management-v1',type:'session',authenticated:false},location.origin));
  await page.getByRole('button',{name:'管理后台',exact:true}).click();
  await expect(manager(page).getByRole('dialog',{name:'Admin control panel'})).toBeVisible();
  await manager(page).getByRole('button',{name:'Close admin panel',exact:true}).click();
  await expect(plugin).toContainText('"n":1');expect(page.url()).toBe(url);
});

test('management document ignores plugin previews and edits travel through v1',async({page})=>{
  await productionOrigins(page);
  await page.addInitScript(profile=>{if(location.hostname==='www.fyuoblog.top')sessionStorage.setItem('user',JSON.stringify(profile));},user);
  const assets=[];page.on('request',r=>{if(r.url().includes('/plugin-assets/')||r.url().includes('/manifest'))assets.push(r.url());});
  let mutation;
  await page.route('**/api/v1/travel-places',r=>{
    if(r.request().method()==='POST'){mutation=r.request().postDataJSON();return r.fulfill({status:201,json:{data:{id:2,...mutation}}});}
    return r.fulfill({json:{data:[]}});
  });
  await page.goto(origins[1]+'/manage?__plugin_preview=1');await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('button',{name:'content.',exact:true}).click();
  await page.getByRole('button',{name:'旅行记录',exact:true}).click();await page.getByRole('button',{name:'新建',exact:true}).click();
  await page.getByLabel('地点',{exact:true}).fill('Kyoto');await page.getByLabel('纬度',{exact:true}).fill('35');await page.getByLabel('经度',{exact:true}).fill('135');
  await page.getByRole('button',{name:'保存',exact:true}).click();await expect.poll(()=>mutation?.name).toBe('Kyoto');
  expect(mutation.latitude).toBe(35);expect(assets).toEqual([]);
});

for(const origin of origins) for(const width of [390,1440]) {
  test(`${origin} login management logout preserve blog state at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});await productionOrigins(page);await page.goto(origin+'/blog?keep=1#journal');
    await expect(page.locator('.blog-title')).toBeVisible();await expect(page.locator('.remote-management')).toBeHidden();
    await expect(page.getByRole('button',{name:'Migration fixture',exact:true})).toBeVisible();
    await page.evaluate(()=>document.fonts.ready);
    const reader=page.locator('.plugin-shell__reader');await reader.evaluate(el=>{el.style.scrollBehavior='auto';el.scrollTop=Math.min(80,el.scrollHeight-el.clientHeight);});
    await expect.poll(()=>reader.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
    const scroll=await reader.evaluate(el=>el.scrollTop),url=page.url();
    await page.getByRole('button',{name:'log-in.',exact:true}).click();const panel=manager(page);
    await expect(panel.getByRole('dialog',{name:'log-in.'})).toBeVisible();expect(page.url()).toBe(url);
    await expect(page.locator('.studio-shell')).toHaveAttribute('inert','');
    await expect(panel.locator('.sign-in-modal__masthead')).toHaveCSS('background-color','rgb(255, 52, 85)');
    await signIn(page);await page.getByRole('button',{name:'管理后台',exact:true}).click();
    await expect(panel.getByRole('dialog',{name:'Admin control panel'})).toBeVisible();
    await panel.getByRole('button',{name:'content.',exact:true}).click();await expect(panel.getByRole('button',{name:/Migration fixture/})).toBeVisible();
    await panel.getByRole('button',{name:'Close admin panel',exact:true}).click();
    await expect(page.locator('.remote-management')).toBeHidden();
    expect(await reader.evaluate(el=>el.scrollTop)).toBe(scroll);expect(page.url()).toBe(url);
    await page.getByRole('button',{name:'退出',exact:true}).click();await expect(page.getByRole('button',{name:'log-in.',exact:true})).toBeVisible();
    await expect(page.locator('.remote-management')).toBeHidden();await page.reload();
    await expect(page.locator('.remote-management')).toBeHidden();await expect(page.locator('.blog-title')).toBeVisible();
  });
}
for(const width of [390,1440]) {
  test(`authenticated content layout and article save at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});await productionOrigins(page);
    await page.addInitScript(profile=>{if(location.hostname==='www.fyuoblog.top')sessionStorage.setItem('user',JSON.stringify(profile));},user);
    const writes=[];page.on('request',r=>{if(r.method()==='PUT'&&r.url().endsWith('/articles/42'))writes.push(r.postDataJSON());});
    await page.goto(origins[0]+'/blog');await page.getByRole('button',{name:'管理后台',exact:true}).click();const panel=manager(page);
    await panel.getByRole('button',{name:'content.',exact:true}).click();const row=panel.getByRole('button',{name:/Migration fixture/});await expect(row).toBeVisible();
    expect((await row.boundingBox()).width).toBeGreaterThan(width<600?300:700);
    await row.click();await panel.getByPlaceholder('Article title...').fill('Updated article');await panel.getByRole('button',{name:'保存',exact:true}).click();
    await expect.poll(()=>writes.length).toBe(1);expect(writes[0].title).toBe('Updated article');expect(writes[0].content).toContain('Preserved Markdown');
    await row.click();await panel.getByRole('button',{name:'back.',exact:true}).last().click();await expect(row).toBeVisible();expect(writes).toHaveLength(1);
    await panel.getByRole('button',{name:'首页内容',exact:true}).click();await expect(panel.getByLabel('封面简介',{exact:true})).toBeVisible();
  });
}
for(const width of [390,768,1440,1920]) {
  test(`local and embedded production dialogs render identically at ${width}px`,async({browser},info)=>{
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    const local=await context.newPage(),production=await context.newPage();
    try {
      await mockBusinessAPI(local);await productionOrigins(production);
      await local.goto('http://127.0.0.1:5177/');await production.goto(origins[0]+'/blog');
      await local.getByRole('button',{name:'log-in.',exact:true}).click();await production.getByRole('button',{name:'log-in.',exact:true}).click();
      const panel=manager(production);await expect(panel.getByRole('dialog',{name:'log-in.'})).toBeVisible();
      const compare=async(selector,name)=>{
        const expected=local.locator(selector),actual=panel.locator(selector);await expect(expected).toBeVisible();await expect(actual).toBeVisible();
        await local.evaluate(()=>document.fonts.ready);await actual.evaluate(()=>document.fonts.ready);
        expect(await actual.boundingBox()).toEqual(await expected.boundingBox());
        await expected.evaluate(()=>document.activeElement?.blur());await actual.evaluate(()=>document.activeElement?.blur());
        await local.mouse.move(0,0);await production.mouse.move(0,0);
        const a=await expected.screenshot({path:info.outputPath(`local-${name}.png`),animations:'disabled'}),b=await actual.screenshot({path:info.outputPath(`production-${name}.png`),animations:'disabled'});
        const max=await local.evaluate(async([left,right])=>{
          async function pixels(source){const image=new Image();image.src='data:image/png;base64,'+source;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);return ctx.getImageData(0,0,image.width,image.height).data;}
          const [x,y]=await Promise.all([pixels(left),pixels(right)]);if(x.length!==y.length)return 255;let max=0;for(let i=0;i<x.length;i++)max=Math.max(max,Math.abs(x[i]-y[i]));return max;
        },[a.toString('base64'),b.toString('base64')]);expect(max,`${name} pixels`).toBeLessThanOrEqual(8);
      };
      const style='.sign-in-modal,.admin-panel{background:#1e2020!important;backdrop-filter:none!important} *{animation:none!important;transition:none!important}';
      await local.addStyleTag({content:style});await panel.locator('body').evaluate((el,css)=>{const s=document.createElement('style');s.textContent=css;el.append(s);},style);
      await local.getByPlaceholder('name-plz').focus();await compare('.sign-in-modal__panel','login');
      for(const target of [local,panel]) {
        await target.getByPlaceholder('name-plz').fill('migration-test');await target.getByPlaceholder('and-psw').fill('fixture-password');await target.getByRole('button',{name:'UNLOCK THE DESK',exact:true}).click();
        await expect(target.getByText('logged-in.',{exact:true})).toBeVisible();await target.getByRole('button',{name:'关闭登录窗口',exact:true}).click();
      }
      const toast=local.getByRole('button',{name:'close',exact:true});if(await toast.isVisible())await toast.click();
      for(const page of [local,production])await page.getByRole('button',{name:'管理后台',exact:true}).click();
      for(const target of [local,panel])await expect(target.getByText('还没有插件，上传第一个 ZIP 开始使用。',{exact:true})).toBeVisible();
      await compare('.admin-panel__surface','plugins');for(const target of [local,panel])await target.getByRole('button',{name:'content.',exact:true}).click();
      for(const target of [local,panel])await expect(target.getByRole('button',{name:/Migration fixture/})).toBeVisible();await compare('.admin-panel__surface','content');
    } finally {await context.close();}
  });
}
for(const origin of origins) {
  test(`${origin} configured showcase survives login without navigation`,async({page})=>{
    await productionOrigins(page);await page.goto(origin+'/');const card=page.locator('.cover-flow__item');await expect(card).toHaveCount(1);const url=page.url();
    await page.getByRole('button',{name:'log-in.',exact:true}).click();await expect(manager(page).getByRole('dialog',{name:'log-in.'})).toBeVisible();
    await manager(page).getByRole('button',{name:'关闭登录窗口',exact:true}).click();await expect(page.locator('#studio-title')).toBeVisible();expect(page.url()).toBe(url);await expect(card).toHaveCount(1);
  });
}
