import { test, expect } from '@playwright/test';
import { mockBusinessAPI, user } from './plugin-fixtures.mjs';
import { manager, origins, productionOrigins } from './production-fixtures.mjs';

const records = Array.from({ length: 225 }, (_, index) => ({ id: index + 1, article_id: 42,
  content_title: `文章 ${index + 1}`, visitor_id: `browser-${index % 4}`, ip_address: '198.51.100.1',
  city: index % 2 ? 'unknown' : 'local network', created_at: '2026-11-03T05:00:00Z' }));

async function visitAPI(page, state = {}) {
  await page.route('**/api/v1/visit-records?**', async route => {
    const params = new URL(route.request().url()).searchParams;
    state.last = params;
    if (state.fail) return route.fulfill({ status: 503, json: { error: '查询服务暂时不可用' } });
    const rows = state.empty ? [] : params.get('search') ? records.filter(row => row.content_title === params.get('search')) : records;
    const ordered = params.get('sort') === 'oldest' ? rows : [...rows].reverse();
    const size = Number(params.get('page_size'));
    const current = Number(params.get('page'));
    await route.fulfill({ json: { data: ordered.slice((current - 1) * size, current * size), total: rows.length,
      browser_count: rows.length ? 4 : 0, article_count: rows.length ? 1 : 0,
      page: current, page_size: size, total_pages: Math.ceil(rows.length / size) } });
  });
}

for (const width of [320, 375, 414, 768, 1183, 1440]) {
  test(`visitor records fit the embedded dialog at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 956 });
    await productionOrigins(page);
    await page.addInitScript(profile => {
      if (location.hostname === 'www.fyuoblog.top') sessionStorage.setItem('user', JSON.stringify(profile));
    }, user);
    await visitAPI(page);
    await page.goto(origins[0]);
    await page.getByRole('button', { name: '管理后台', exact: true }).click();
    const panel = manager(page);
    await assertNoBorders(panel);
    await panel.getByRole('button', { name: 'visitor-records.', exact: true }).click();
    const visits = panel.getByRole('region', { name: '文章访问记录', exact: true });
    await expect(visits.getByRole('status')).toContainText('共 225 条');
    await expect(visits.locator('tbody tr')).toHaveCount(25);
    const layout = await visits.evaluate(el => ({ overflow: el.scrollWidth > el.clientWidth, height: el.clientHeight,
      hasInnerScroll: el.querySelector('.visit-records__table').scrollWidth > el.querySelector('.visit-records__table').clientWidth }));
    expect(layout.overflow).toBe(false);
    expect(layout.height).toBeGreaterThan(200);
    if (width <= 414) expect(layout.hasInnerScroll).toBe(true);
    await assertNoBorders(panel);
    await visits.getByRole('button', { name: '刷新记录' }).focus();
    await expect(visits.getByRole('button', { name: '刷新记录' })).toHaveCSS('outline-width', '3px');
    await panel.locator('.admin-panel__surface').screenshot({ path: info.outputPath(`visits-${width}.png`) });
  });
}

test('visitor queries paginate, filter, reset and recover from failures', async ({ page }) => {
  await mockBusinessAPI(page, { signedIn: true });
  const state = {};
  await visitAPI(page, state);
  await page.goto('/');
  await page.getByRole('button', { name: '管理后台', exact: true }).click();
  await page.getByRole('button', { name: 'visitor-records.', exact: true }).click();
  const visits = page.getByRole('region', { name: '文章访问记录', exact: true });
  await expect(visits.getByRole('status')).toContainText('共 225 条');
  await expect(visits.getByRole('button', { name: '上一页' })).toBeDisabled();
  await visits.getByRole('button', { name: '下一页' }).click();
  await expect(visits.getByRole('status')).toContainText('26–50');
  await visits.getByLabel('时间排序').selectOption('oldest');
  await expect(visits.locator('tbody tr').first()).toContainText('文章 1');
  await expect(visits.getByRole('button', { name: '上一页' })).toBeDisabled();
  await visits.getByLabel('每页条数').selectOption('50');
  await expect(visits.locator('tbody tr')).toHaveCount(50);
  await visits.getByLabel('搜索', { exact: true }).fill('文章 7');
  await visits.getByLabel('开始日期').fill('2026-11-01');
  await visits.getByLabel('结束日期').fill('2026-11-03');
  await visits.getByLabel('文章 ID', { exact: true }).fill('42');
  await visits.getByRole('button', { name: '应用筛选' }).click();
  await expect(visits.getByRole('status')).toContainText('共 1 条');
  expect(state.last.get('article_id')).toBe('42');
  expect(Date.parse(state.last.get('until')) - Date.parse(state.last.get('from'))).toBe(3 * 86400000);
  await visits.getByLabel('开始日期').fill('2026-11-05');
  await visits.getByRole('button', { name: '应用筛选' }).click();
  await expect(visits.getByRole('alert')).toContainText('结束日期不能早于开始日期');
  await visits.getByRole('button', { name: '重置', exact: true }).click();
  await expect(visits.getByRole('status')).toContainText('共 225 条');
  expect(state.last.has('article_id')).toBe(false);
  state.fail = true;
  await visits.getByRole('button', { name: '刷新记录' }).click();
  await expect(visits.getByRole('alert')).toContainText('查询服务暂时不可用');
  await expect(visits.locator('tbody tr')).toHaveCount(0);
  await expect(visits.getByRole('button', { name: '下一页' })).toBeDisabled();
  state.fail = false;
  state.empty = true;
  await visits.getByRole('button', { name: '重新加载' }).click();
  await expect(visits.getByRole('status')).toContainText('没有符合条件');
  await expect(visits.getByRole('alert')).toHaveCount(0);
});

async function assertNoBorders(panel) {
  const visibleBorders = await panel.locator('.admin-panel__surface').evaluate(el => [el, ...el.querySelectorAll('*')]
    .filter(node => node.getBoundingClientRect().width && node.getBoundingClientRect().height)
    .filter(node => ['Top', 'Right', 'Bottom', 'Left'].some(side => parseFloat(getComputedStyle(node)[`border${side}Width`]) > 0))
    .map(node => node.className));
  expect(visibleBorders).toEqual([]);
}
