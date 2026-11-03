import { test, expect } from '@playwright/test';
import { article, mockBusinessAPI, user } from './plugin-fixtures.mjs';
import { manager, origins, productionOrigins } from './production-fixtures.mjs';

const titles = [
  'Moss 已接入本站',
  '📅 第25周工作周报（06/15 - 06/21）',
  '📷 fyuobot 的图片识别功能 —— AI Agent 如何读取上传的图片并处理图文内容',
  '🔧 fyuobot Git 操作规范：提交信息与分支管理',
  'LongUnbrokenArticleTitle'.repeat(8),
];

for (const width of [320, 375, 414, 768, 1106, 1440]) {
  test(`embedded content rows keep their own layout at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 956 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await productionOrigins(page);
    await page.addInitScript(profile => {
      if (location.hostname === 'www.fyuoblog.top') sessionStorage.setItem('user', JSON.stringify(profile));
    }, user);
    await checkList(page, manager(page), origins[0], width, info);
  });
}

test('local content rows match the embedded management layout', async ({ page }, info) => {
  await page.setViewportSize({ width: 1106, height: 956 });
  await mockBusinessAPI(page, { signedIn: true });
  await checkList(page, page, '/', 1106, info);
});

async function checkList(page, panel, url, width, info) {
  await page.route('**/api/v1/articles?**', route => route.fulfill({ json: {
    data: titles.map((title, index) => ({ ...article, id: 42 + index, title, stage: index === 1 ? 'draft' : 'published' })),
    total: titles.length,
  } }));
  await page.goto(url);
  await page.getByRole('button', { name: '管理后台', exact: true }).click();
  await panel.getByRole('button', { name: 'content.', exact: true }).click();
  const editor = panel.getByRole('region', { name: '内容编辑' });
  const rows = editor.locator('.secure-content__item-button');
  await expect(rows).toHaveCount(titles.length);
  const layout = await editor.evaluate(el => {
    const row = el.querySelector('.secure-content__item-button');
    const css = getComputedStyle(row);
    const button = el.querySelector('.secure-content__tabs button[aria-pressed=true]');
    const other = el.querySelector('.secure-content__tabs button[aria-pressed=false]');
    const boxes = [...el.querySelectorAll('.secure-content__item-button')].map(item => {
      const r = item.getBoundingClientRect();
      const title = item.querySelector('.secure-content__item-title').getBoundingClientRect();
      const meta = item.querySelector('.secure-content__item-meta').getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, overflow: item.scrollWidth > item.clientWidth,
        overlap: title.left < meta.right && title.right > meta.left && title.top < meta.bottom && title.bottom > meta.top };
    });
    return { background: css.backgroundColor, color: css.color,
      radius: css.borderBottomLeftRadius,
      selected: getComputedStyle(button).backgroundColor, other: getComputedStyle(other).backgroundColor,
      overflow: el.scrollWidth > el.clientWidth, boxes };
  });
  expect(layout.background).not.toBe(layout.selected);
  expect(layout.selected).not.toBe(layout.other);
  expect(layout.color).not.toBe(layout.background);
  expect(layout.radius).toBe('24px');
  expect(layout.overflow).toBe(false);
  for (const [index, box] of layout.boxes.entries()) {
    expect(box.overflow).toBe(false);
    expect(box.overlap).toBe(false);
    if (index) expect(box.top - layout.boxes[index - 1].bottom).toBeGreaterThanOrEqual(12);
  }
  await rows.first().focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(rows.first()).toBeFocused();
  await expect(rows.first()).toHaveCSS('outline-style', 'solid');
  await expect(rows.first()).toHaveCSS('outline-width', '3px');
  await panel.locator('.admin-panel__surface').screenshot({ path: info.outputPath(`content-${width}.png`) });
  await rows.first().press('Enter');
  await expect(editor.getByPlaceholder('Article title...')).toHaveValue(article.title);
  await editor.getByRole('button', { name: '取消', exact: true }).click();
  await expect(rows).toHaveCount(titles.length);
  await expect(editor.getByText('草稿', { exact: true })).toBeVisible();
}
