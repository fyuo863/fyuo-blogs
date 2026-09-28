import { test, expect } from '@playwright/test';
import { mockBusinessAPI } from './plugin-fixtures.mjs';

test('empty installation stays usable without any page plugins', async ({ page }) => {
  await mockBusinessAPI(page, { signedIn: true });
  await page.route('**/api/v1/plugins', route => route.fulfill({ json: { data: [] } }));
  await page.route('**/api/v1/admin/plugins', route => route.fulfill({ json: { data: [] } }));
  const manifests = [];
  page.on('request', request => { if (request.url().includes('/manifest')) manifests.push(request.url()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '还没有已发布的页面' })).toBeVisible();
  await expect(page.locator('.plugin-sidebar__tab')).toHaveCount(0);
  await page.mouse.move(300, 600);
  await expect(page.getByRole('button', { name: '管理后台', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '打开插件管理' }).click();
  await expect(page.getByRole('region', { name: '插件管理' })).toBeVisible();
  await expect(page.getByLabel('插件 ZIP')).toBeEnabled();
  expect(manifests).toEqual([]);
});

test('home uses first published plugin and has no required core page', async ({ page }) => {
  await mockBusinessAPI(page);
  await page.route('**/api/v1/plugins', route => route.fulfill({ json: { data: [{ slug: 'custom-page', name: 'Custom' }] } }));
  await page.route('**/api/v1/plugins/custom-page/manifest', route => route.fulfill({ json: { data: { id: 'custom-page', name: 'Custom', version: '1.0.0', type: 'module', apiVersion: 1, entry: 'entry.js' } } }));
  await page.route('**/plugin-assets/custom-page/**', route => route.fulfill({ contentType: 'text/javascript', body: 'export default function Page() { return globalThis.__FYUO_PLUGIN_HOST_V1__.react.createElement("h1", null, "Independent page"); }' }));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Independent page' })).toBeVisible();
  await expect(page.locator('.plugin-sidebar__select')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Custom', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Independent page' })).toBeVisible();
});

test('catalog failure is distinct from an empty site and can be retried', async ({ page }) => {
  await mockBusinessAPI(page);
  let failed = true;
  await page.route('**/api/v1/plugins', route => failed ? route.fulfill({ status: 503 }) : route.fulfill({ json: { data: [] } }));
  await page.goto('/');
  await expect(page.getByRole('alert')).toHaveText('无法加载插件列表');
  await expect(page.getByRole('heading', { name: '还没有已发布的页面' })).toHaveCount(0);
  failed = false;
  await page.getByRole('button', { name: '重试' }).click();
  await expect(page.getByRole('heading', { name: '还没有已发布的页面' })).toBeVisible();
  await page.getByRole('button', { name: '管理员登录' }).click();
  await expect(page.getByRole('dialog', { name: 'log-in.' })).toBeVisible();
});
