import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { test, expect } from '@playwright/test';
import { mockBusinessAPI } from './plugin-fixtures.mjs';

test.beforeAll(() => { execFileSync(process.execPath, ['scripts/build-ai-coding.mjs'], { stdio: 'pipe' }); });

async function setup(page) {
  await mockBusinessAPI(page);
  const manifest = JSON.parse(await readFile('plugin-dist/ai-coding/manifest.json', 'utf8'));
  await page.route('**/api/v1/plugins', route => route.fulfill({ json: { data: [{ slug: 'ai-coding', name: 'AI Coding' }] } }));
  await page.route('**/api/v1/plugins/ai-coding/manifest', route => route.fulfill({ json: { data: manifest } }));
  await page.route('**/plugin-assets/ai-coding/**', async route => {
    const name = new URL(route.request().url()).pathname.split('/').at(-1);
    if (!['entry.js', 'style.css'].includes(name)) return route.fulfill({ status: 404 });
    await route.fulfill({ body: await readFile(`plugin-dist/ai-coding/${name}`), contentType: name.endsWith('.css') ? 'text/css' : 'text/javascript' });
  });
}

test('ai coding renders public summaries, responsive layout and stale data honestly', async ({ page }) => {
  await setup(page);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let failed = false;
  // Explicit synthetic fixture: never included in the plugin ZIP.
  const data = { schemaVersion: 1, updatedAt: new Date().toISOString(), totals: { today: 12000, month: 240000, allTime: 1200000 }, daily: Array.from({ length: 90 }, (_, i) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - i); return { date: d.toISOString().slice(0, 10), tokens: (i % 9 + 1) * 1200 }; }), tools: [{ name: 'Codex', tokens: 1200000 }], models: [{ name: 'Test model', tokens: 1200000 }] };
  await page.route('**/api/v1/showcase/ai-coding', route => failed ? route.fulfill({ status: 503 }) : route.fulfill({ json: data }));
  await page.goto('/');
  await expect(page.locator('.aic-totals')).toContainText('1.2M');
  for (const width of [320, 375, 414, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.locator('.aic-page').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.locator('.aic-masthead').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/ai-coding-${width}.png` });
    await page.locator('.aic-footer').scrollIntoViewIfNeeded();
    await expect(page.locator('.aic-footer')).toBeInViewport();
    await page.screenshot({ path: `test-results/ai-coding-${width}-bottom.png` });
  }
  await page.getByRole('button', { name: '7 天', exact: true }).click();
  await expect(page.locator('.aic-bars>div')).toHaveCount(7);
  failed = true;
  await page.locator('.aic-status button').click();
  await expect(page.locator('.aic-status')).toContainText('保留最近记录');
  await expect(page.locator('.aic-totals')).toContainText('1.2M');
  await expect(page.locator('.plugin-sidebar__preview iframe')).toHaveCount(1);
  await expect(page.frameLocator('.plugin-sidebar__preview iframe').locator('.aic-totals')).toContainText('1.2M');
  expect(errors).toEqual([]);
});

test('ai coding unavailable or malformed feed does not invent usage', async ({ page }) => {
  await setup(page);
  await page.route('**/api/v1/showcase/ai-coding', route => route.fulfill({ json: { invalid: true } }));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.aic-status')).toContainText('等待首次同步');
  await expect(page.locator('.aic-totals strong')).toHaveText(['—', '—', '—']);
  await page.screenshot({ path: 'test-results/ai-coding-empty.png', fullPage: true });
});
