import { test, expect } from '@playwright/test';
import { origins, productionOrigins, manager } from './production-fixtures.mjs';
import { user } from './plugin-fixtures.mjs';

for (const origin of origins) for (const width of [390,1440]) {
  test(`${origin} trusted routes match local presentation at ${width}px`,async({browser})=>{
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    const local=await context.newPage(), deployed=await context.newPage();
    try {
      await productionOrigins(local);await productionOrigins(deployed);
      for (const [path,selector] of [['/','#studio-title'],['/blog','.blog-title'],['/plugins','.studio-catalog__heading']]) {
        await local.goto('http://127.0.0.1:5177'+path);await deployed.goto(origin+path);
        for (const page of [local,deployed]) {await expect(page.locator(selector)).toBeVisible();await page.evaluate(()=>document.fonts.ready);}
        const presentation=async page=>page.locator(selector).evaluate(el=>{
          const css=getComputedStyle(el),box=el.getBoundingClientRect();
          return {text:el.textContent,width:box.width,height:box.height,color:css.color,font:css.fontFamily,fontSize:css.fontSize,background:getComputedStyle(document.querySelector('.studio-shell')).backgroundColor};
        });
        expect(await presentation(deployed)).toEqual(await presentation(local));
        expect(await deployed.locator('.studio-nav [aria-current="page"]').textContent()).toEqual(await local.locator('.studio-nav [aria-current="page"]').textContent());
        expect(await deployed.locator('.studio-shell').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
      }
    } finally {await context.close();}
  });
  test(`${origin} article search and reading remain mounted behind login at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});await productionOrigins(page);await page.goto(origin+'/blog');
    await page.getByPlaceholder('search.').fill('Migration');await page.getByPlaceholder('search.').press('Enter');
    await page.getByRole('button',{name:'Migration fixture',exact:true}).click();
    await expect(page.locator('strong').filter({hasText:'Original formatting'})).toBeVisible();
    await page.locator('.article-sheet').evaluate(el=>el.dataset.identity='preserved');
    const url=page.url();await page.getByRole('button',{name:'log-in.',exact:true,includeHidden:true}).evaluate(el=>el.click());
    await expect(manager(page).getByRole('dialog',{name:'log-in.'})).toBeVisible();
    await manager(page).getByRole('button',{name:'关闭登录窗口',exact:true}).click();
    await expect(page.locator('.article-sheet')).toHaveAttribute('data-identity','preserved');
    await expect(page.locator('strong').filter({hasText:'Original formatting'})).toBeVisible();expect(page.url()).toBe(url);
    await page.getByRole('button',{name:'back.',exact:true}).first().click();
    await page.getByPlaceholder('search.').fill('Pending search');
    await page.getByRole('button',{name:'log-in.',exact:true}).click();
    await manager(page).getByRole('button',{name:'关闭登录窗口',exact:true}).click();
    await expect(page.getByPlaceholder('search.')).toHaveValue('Pending search');
  });
}

test('www plugins execute on public origin with full motion, permissions and unchanged state',async({page})=>{
  await productionOrigins(page);
  await page.route('**/api/v1/plugins/probe/manifest',r=>r.fulfill({json:{data:{id:'probe',version:'1',type:'module',apiVersion:1,entry:'entry.js'}}}));
  await page.route('**/plugin-assets/probe/**',r=>r.fulfill({contentType:'text/javascript',body:`export default function Probe(props){const R=globalThis.__FYUO_PLUGIN_HOST_V1__.react;const [n,setN]=R.useState(0);return R.createElement('section',null,R.createElement('button',{onClick:()=>setN(n+1)},JSON.stringify({n,origin:location.origin,preview:new URLSearchParams(location.search).get('__plugin_preview'),keep:new URLSearchParams(location.search).get('keep'),user:props.user,microphone:(document.permissionsPolicy||document.featurePolicy).allowsFeature('microphone')})),R.createElement('a',{href:'https://example.com/plugin-link',target:'_blank',rel:'noreferrer'},'Plugin external link'));}`}));
  await page.context().route('https://example.com/plugin-link',r=>r.fulfill({contentType:'text/html',body:'<h1>Plugin destination</h1>'}));
  await page.goto(origins[1]+'/p/probe?keep=yes#plugin');
  const plugin=page.frameLocator('.public-plugin-frame').getByRole('button',{name:/"microphone"/});
  await expect(plugin).toContainText('"origin":"https://fyuoblog.top"');await expect(plugin).toContainText('"preview":null');await expect(plugin).toContainText('"keep":"yes"');await expect(plugin).toContainText('"user":null');
  await expect(plugin).toContainText('"microphone":true');
  await plugin.click();await page.getByRole('button',{name:'log-in.',exact:true}).click();
  await expect(manager(page).getByRole('dialog',{name:'log-in.'})).toBeVisible();await manager(page).getByPlaceholder('name-plz').focus();await page.keyboard.press('Escape');
  await expect(page.locator('.remote-management')).toBeHidden();await expect(plugin).toContainText('"n":1');
  await expect(page.getByRole('button',{name:'log-in.',exact:true})).toBeFocused();
  const popupPromise=page.waitForEvent('popup');await page.frameLocator('.public-plugin-frame').getByRole('link',{name:'Plugin external link'}).click();
  const popup=await popupPromise;await expect(popup.getByRole('heading',{name:'Plugin destination'})).toBeVisible();await popup.close();
  expect(page.url()).toBe(origins[1]+'/p/probe?keep=yes#plugin');
});

for (const width of [390,1440]) test(`visitor records and API key lifecycle work inside management at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await productionOrigins(page);
  await page.addInitScript(profile=>{if(location.hostname==='www.fyuoblog.top')sessionStorage.setItem('user',JSON.stringify(profile));},user);
  const sorts=[],writes=[];let keys=[];
  await page.route('**/api/v1/visit-records?**',route=>{
    expect(route.request().headers().authorization).toBe(`Bearer ${user.token}`);
    sorts.push(new URL(route.request().url()).searchParams.get('sort'));
    return route.fulfill({json:{data:[{id:1,content_title:'Recorded article',article_id:42,visitor_id:'test-visitor',ip_address:'127.0.0.1',city:'Local fixture',created_at:'2026-10-01T00:00:00Z'}]}});
  });
  await page.route('**/api/v1/admin/publisher-users',r=>r.fulfill({json:{data:[{id:2,name:'publisher-fixture',role:'publisher'}]}}));
  await page.route('**/api/v1/admin/api-keys**',async route=>{
    const request=route.request();expect(request.headers().authorization).toBe(`Bearer ${user.token}`);
    if(request.method()==='GET')return route.fulfill({json:{data:keys}});
    writes.push({method:request.method(),path:new URL(request.url()).pathname,body:request.postDataJSON()});
    if(request.method()==='DELETE')keys=[];
    else if(request.method()==='PATCH')keys[0].enabled=request.postDataJSON().enabled;
    else if(!request.url().endsWith('/rotate'))keys=[{id:1,name:request.postDataJSON().name,user_name:'publisher-fixture',user_role:'publisher',enabled:true}];
    return route.fulfill({json:{data:{key:request.url().endsWith('/rotate')?'rotated-fixture-secret':'new-fixture-secret'}}});
  });
  await page.goto(origins[0]+'/blog');await page.getByRole('button',{name:'管理后台',exact:true}).click();const panel=manager(page);
  await panel.getByRole('button',{name:'visitor-records.',exact:true}).click();await expect(panel.getByRole('cell',{name:'Recorded article',exact:true})).toBeVisible();
  await panel.getByRole('combobox').selectOption('oldest');await expect.poll(()=>sorts.at(-1)).toBe('oldest');
  await panel.getByRole('button',{name:'mcp-dispatch.',exact:true}).click();await panel.getByPlaceholder('agent-main').fill('Agent fixture');
  await panel.getByRole('combobox').selectOption('2');await panel.getByRole('button',{name:'create key',exact:true}).click();
  await expect(panel.getByText('new-fixture-secret',{exact:true})).toBeVisible();expect(writes[0].body).toEqual({name:'Agent fixture',user_id:2});
  await panel.getByRole('button',{name:'close',exact:true}).click();
  await panel.getByRole('button',{name:'enabled',exact:true}).click();await expect(panel.getByRole('button',{name:'disabled',exact:true})).toBeVisible();
  await panel.getByRole('button',{name:'rotate',exact:true}).click();await expect(panel.getByText('rotated-fixture-secret',{exact:true})).toBeVisible();
  await panel.getByRole('button',{name:'close',exact:true}).click();await panel.getByRole('button',{name:'delete',exact:true}).click();
  await expect(panel.getByText('no api keys.',{exact:true})).toBeVisible();expect(writes.map(x=>x.method)).toEqual(['POST','PATCH','POST','DELETE']);
  expect(await page.evaluate(()=>JSON.stringify({local:localStorage.getItem('user'),session:sessionStorage.getItem('user')}))).not.toContain('fixture-secret');
  expect(page.url()).toBe(origins[0]+'/blog');
});
