import {test,expect} from '@playwright/test';
import {build} from 'vite';
import react from '@vitejs/plugin-react';
let bundle;
test.beforeAll(async()=>{
 const result=await build({configFile:false,define:{'process.env.NODE_ENV':'"production"'},plugins:[react()],logLevel:'silent',build:{write:false,lib:{entry:'tests/fixtures/showcase-harness.jsx',formats:['iife'],name:'ShowcaseTest'},minify:false}});
 bundle=(Array.isArray(result)?result[0]:result).output.find(item=>item.type==='chunk').code;
});
test('repository content refreshes and survives invalid updates',async({page})=>{
 let requests=0;
 const album={id:'first',title:'测试专辑',cover:'./covers/first.svg',content:'## 背面正文\n[说明](./guide.md)',url:'https://github.com/example/project'};
 await page.route('**/showcase-test',route=>route.fulfill({contentType:'text/html',body:'<meta charset="utf-8"><style>.cover-flow__item{transform:none!important}.cover-flow__wood-grain,.cover-flow__reflection{display:none}</style><div id="root"></div><script src="/showcase-test.js"></script>'}));
 await page.route('**/showcase-test.js',route=>route.fulfill({contentType:'text/javascript',body:bundle}));
 await page.route('https://raw.githubusercontent.com/example/showcase/main/**',route=>{
  if(!route.request().url().endsWith('showcase.json')) return route.fulfill({body:''});
  requests++;
  return route.fulfill({json:requests===2?{version:99}:{version:1,albums:[{...album,title:requests>=3?'更新后的专辑':album.title}]}});
 });
 await page.clock.install();
 await page.goto('/showcase-test');
 await expect(page.getByRole('button',{name:'查看 测试专辑'})).toBeVisible();
 await expect(page.locator('.cover-flow__item > .cover-flow__sleeve .cover-flow__front img')).toHaveAttribute('data-cover-source','https://raw.githubusercontent.com/example/showcase/main/covers/first.svg');
 await page.getByRole('button',{name:'查看 测试专辑'}).click();
 await expect(page.getByRole('heading',{name:'背面正文'})).toBeVisible();
 await expect(page.getByRole('link',{name:'说明'})).toHaveAttribute('href','https://raw.githubusercontent.com/example/showcase/main/guide.md');
 await page.clock.fastForward(60000);
 await expect(page.getByRole('status')).toContainText('暂时无法读取');
 await expect(page.getByRole('heading',{name:'测试专辑',exact:true})).toBeVisible();
 await page.clock.fastForward(60000);
 await expect(page.locator('.cover-flow__navigation p')).toHaveText('更新后的专辑');
 await expect(page.getByRole('status')).toBeEmpty();
});
