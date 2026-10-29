import { test, expect } from '@playwright/test';
import { article, mockBusinessAPI } from './plugin-fixtures.mjs';

const content = [
  '## MCP 服务接入说明',
  '正文支持 **重点内容**、[相关文档](https://example.com) 和 `inline_code`。',
  '> 引用内容使用当前站点的卡片背景。',
  '> [!WARNING] 调用说明\n> 发布之前检查文章内容。',
  '```js\nconst endpoint = "https://fyuoblog.top/mcp";\n' + 'x'.repeat(220) + '\n```',
  '| 工具 | 用途 | 参数 | 返回结果 |\n| --- | --- | --- | --- |\n| blog_list_posts | 查看文章 | page | data |',
  '- 查询文章\n- 上传图片',
].join('\n\n');

for (const width of [375, 1440]) {
  test(`article components share the studio theme and return preserves the list at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 956 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockBusinessAPI(page);
    await page.route('**/api/v1/articles', route => route.fulfill({ json: {
      data: [{ ...article, title: '博客 MCP 接入与文章管理说明', content, tags: ['公告', 'MCP'] }], total: 1,
    } }));
    await page.goto('/blog');
    const list = page.locator('.route-live-layer.is-current .plugin-shell__reader');
    await page.getByRole('button', { name: '博客 MCP 接入与文章管理说明', exact: true }).scrollIntoViewIfNeeded();
    const scrollTop = await list.evaluate(el => el.scrollTop);
    await page.getByRole('button', { name: '博客 MCP 接入与文章管理说明', exact: true }).click();
    const sheet = page.locator('.article-sheet');
    await expect(sheet.locator('h1')).toHaveText('博客 MCP 接入与文章管理说明');
    const styles = await sheet.evaluate(el => {
      const css = selector => getComputedStyle(el.querySelector(selector));
      const rect = selector => el.querySelector(selector).getBoundingClientRect();
      return {
        background: getComputedStyle(el).backgroundColor,
        shellBackground: getComputedStyle(document.querySelector('.studio-shell')).backgroundColor,
        header: css('.article-reader__header').backgroundColor,
        code: css('.markdown-block--code').backgroundColor,
        quote: css('.markdown-block--quote').backgroundColor,
        callout: css('.markdown-callout').backgroundColor,
        radius: css('.markdown-block--code').borderBottomLeftRadius,
        headerRadius: css('.article-reader__header').borderBottomLeftRadius,
        tagRadius: css('.article-reader__tags > span').borderTopLeftRadius,
        tag: css('.article-reader__tags > span').backgroundColor,
        tableHeading: css('th').backgroundColor,
        titleLeft: rect('h1').left,
        metaLeft: rect('.article-reader__meta').left,
        tagsLeft: rect('.article-reader__tags').left,
        overflow: el.scrollWidth > el.clientWidth,
        divider: css('.article-reader__rule').display,
        footerBorder: css('.article-reader__footer').borderTopWidth,
      };
    });
    expect(styles.background).toBe(styles.shellBackground);
    expect(styles.header).not.toBe(styles.background);
    for (const block of ['code', 'quote', 'callout']) expect(styles[block]).toBe(styles.header);
    expect(styles.radius).toBe(styles.headerRadius);
    expect(parseFloat(styles.tagRadius)).toBeGreaterThan(20);
    expect(styles.tag).toBe(styles.tableHeading);
    expect(styles.titleLeft).toBeCloseTo(styles.metaLeft, 0);
    expect(styles.tagsLeft).toBeCloseTo(styles.metaLeft, 0);
    expect(styles.overflow).toBe(false);
    expect(styles.divider).toBe('none');
    expect(styles.footerBorder).toBe('0px');
    await sheet.screenshot({ path: info.outputPath(`article-${width}.png`) });
    // A theme change must reach nested Markdown surfaces, not only the page.
    await sheet.evaluate(el => el.style.setProperty('--studio-panel', 'rgb(50, 60, 40)'));
    await expect(sheet.locator('.markdown-block--code')).toHaveCSS('background-color', 'rgb(50, 60, 40)');
    await expect(sheet.locator('.markdown-callout')).toHaveCSS('background-color', 'rgb(50, 60, 40)');
    await sheet.getByRole('button', { name: 'back.', exact: true }).last().click();
    await expect(sheet).toHaveCount(0);
    expect(await list.evaluate(el => el.scrollTop)).toBeCloseTo(scrollTop, 0);
    await expect(page.getByRole('button', { name: '博客 MCP 接入与文章管理说明', exact: true })).toBeVisible();
  });
}
