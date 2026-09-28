import { execFileSync } from 'node:child_process';
import { test, expect } from '@playwright/test';
import { mockBusinessAPI, user } from './plugin-fixtures.mjs';

test.beforeAll(() => { execFileSync(process.execPath, ['scripts/build-loading-test.mjs'], { stdio: 'pipe' }); });

async function setup(page) {
  await mockBusinessAPI(page, { signedIn: true });
  let plugins = ['index', 'journal', 'travel'].map((slug, index) => ({ id: index + 1, slug, name: slug, status: 'published', active_version: '1.0.0', versions: [{ version: '1.0.0', status: 'published' }] }));
  const mutations = [];
  await page.route('**/api/v1/plugins', route => route.fulfill({ json: { data: plugins.filter(plugin => plugin.status === 'published') } }));
  await page.route('**/api/v1/admin/plugins**', async route => {
    const request = route.request();
    expect(request.headers().authorization).toBe(`Bearer ${user.token}`);
    const path = new URL(request.url()).pathname;
    if (request.method() === 'GET') return route.fulfill({ json: { data: plugins } });
    mutations.push({ path, method: request.method(), body: request.postData() });
    if (path.endsWith('/order')) {
      plugins = request.postDataJSON().slugs.map(slug => plugins.find(plugin => plugin.slug === slug));
    } else if (path.endsWith('/disable')) {
      plugins.find(plugin => plugin.slug === path.split('/')[5]).status = 'disabled';
    } else if (path.includes('/publish/')) {
      const plugin = plugins.find(plugin => plugin.slug === path.split('/')[5]);
      plugin.status = 'published'; plugin.active_version = '1.0.0'; plugin.versions[0].status = 'published';
    } else {
      expect(request.headers()['content-type']).toContain('multipart/form-data');
      expect(request.postData()).toContain('name="file"');
      if (plugins.some(plugin => plugin.slug === 'loading-spinner')) return route.fulfill({ status: 409, json: { error: '该版本已存在，请修改版本号后重新上传' } });
      plugins.push({ id: 4, slug: 'loading-spinner', name: '加载动画测试', status: 'draft', versions: [{ version: '1.0.0', status: 'draft' }] });
      return route.fulfill({ status: 201, json: { data: { plugin_id: 4, version: '1.0.0', status: 'draft' } } });
    }
    return route.fulfill({ json: { message: '成功' } });
  });
  await page.goto('/');
  await page.getByRole('button', { name: '管理后台', exact: true }).click();
  await page.getByRole('button', { name: 'plugins.', exact: true }).click();
  await expect(page.locator('.plugin-manager__row')).toHaveCount(3);
  return mutations;
}

test('admin uploads draft, publishes, sorts, reloads and disables plugins', async ({ page }) => {
  const mutations = await setup(page);
  const manager = page.getByRole('region', { name: '插件管理' });
  await manager.getByLabel('插件 ZIP').setInputFiles('plugin-packages/loading-spinner-1.0.0.zip');
  await manager.getByRole('button', { name: '上传草稿' }).click();
  await expect(manager.locator('.plugin-manager__message')).toContainText('上传成功');
  await expect(page.locator('.plugin-sidebar').getByRole('link', { name: '加载动画测试' })).toHaveCount(0);
  const row = manager.locator('li').filter({ hasText: '加载动画测试' });
  await row.getByRole('button', { name: '发布版本' }).click();
  await expect(page.locator('.plugin-sidebar').getByRole('link', { name: '加载动画测试' })).toHaveCount(1);
  await manager.getByRole('button', { name: '上移 加载动画测试' }).click();
  await manager.getByRole('button', { name: '保存顺序' }).click();
  await expect(manager.locator('.plugin-manager__message')).toContainText('顺序已保存');
  expect(await page.locator('.plugin-sidebar__select').evaluateAll(links => links.map(link => link.getAttribute('aria-label')))).toEqual(['index', 'journal', '加载动画测试', 'travel']);
  await manager.getByRole('button', { name: '刷新列表' }).click();
  await expect(manager.locator('li').nth(2)).toContainText('加载动画测试');
  await row.getByRole('button', { name: '下线', exact: true }).click();
  await expect(page.locator('.plugin-sidebar').getByRole('link', { name: '加载动画测试' })).toHaveCount(0);
  await manager.getByLabel('插件 ZIP').setInputFiles('plugin-packages/loading-spinner-1.0.0.zip');
  await manager.getByRole('button', { name: '上传草稿' }).click();
  await expect(manager.getByRole('alert')).toContainText('该版本已存在');
  expect(mutations.some(item => item.method === 'PUT' && JSON.parse(item.body).slugs[2] === 'loading-spinner')).toBe(true);
});

test('failed order save retains edits and exposes a retry', async ({ page }) => {
  await setup(page);
  await page.route('**/api/v1/admin/plugins/order', route => route.fulfill({ status: 409, json: { error: '插件列表已变化，请刷新后重试' } }));
  await page.getByRole('button', { name: '上移 travel' }).click();
  await page.getByRole('button', { name: '保存顺序' }).click();
  await expect(page.getByRole('alert')).toContainText('插件列表已变化');
  await expect(page.getByRole('button', { name: '保存顺序' })).toBeEnabled();
  await page.getByRole('button', { name: '还原顺序' }).click();
  await expect(page.locator('.plugin-manager__row').last()).toContainText('travel');
});

for (const width of [320, 375, 414, 768, 1440]) {
  test(`plugin management fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await setup(page);
    const manager = page.locator('.plugin-manager');
    expect(await manager.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await expect(page.getByRole('button', { name: '上移 travel' })).toBeVisible();
    await page.screenshot({ path: `test-results/plugin-manager-${width}.png` });
  });
}
