import { readFileSync } from 'node:fs';
import { mockBusinessAPI } from './plugin-fixtures.mjs';
const nginx = readFileSync(new URL('../../nginx.conf',import.meta.url),'utf8');
const policies = [...nginx.matchAll(/add_header Content-Security-Policy "([^"]+)"/g)].map(m=>m[1]);
const permissions = [...nginx.matchAll(/add_header Permissions-Policy "((?:\\.|[^"\\])*)"/g)].map(m=>m[1].replace(/\\"/g,'"'));
export const origins = ['https://fyuoblog.top', 'https://www.fyuoblog.top'];
export const manager = page => page.frameLocator('iframe[title="登录与管理弹窗"]');
export async function productionOrigins(page) {
  await page.route(/^https:\/\/(www\.)?fyuoblog\.top\//, async route => {
    const url = new URL(route.request().url());
    const response = await route.fetch({url:`http://127.0.0.1:5177${url.pathname}${url.search}`});
    const index = url.hostname==='www.fyuoblog.top'?1:0;
    await route.fulfill({response,headers:{...response.headers(),'content-security-policy':policies[index],'permissions-policy':permissions[index]}});
  });
  await mockBusinessAPI(page);
  await page.route('https://raw.githubusercontent.com/**',r=>r.fulfill({json:{version:1,albums:[{id:'configured',title:'Configured showcase',cover:'https://example.com/cover.svg',description:'Configured data'}]}}));
  await page.route('https://example.com/cover.svg',r=>r.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#ff3455"/></svg>'}));
}
