import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { servePlugins } from '../tests/plugin-fixtures.mjs';

const stage = process.argv[2] || 'before';
const destination = new URL(`../migration-artifacts/${stage}/`, import.meta.url);
await mkdir(destination, { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const geometry = {};
for (const width of [1440, 900, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await page.route('**/api/v1/**', async (route) => {
    if (route.request().url().includes('/plugins/') && stage !== 'before') return route.continue();
    const data = route.request().url().includes('home-content') ? null : [];
    await route.fulfill({ json: { data } });
  });
  await page.route('https://gibs.earthdata.nasa.gov/**', route => route.abort());
  if (stage !== 'before') await servePlugins(page);
  for (const [name, path, selector] of [['index', '/', '.home-cover'], ['journal', '/blog', '.blog-title'], ['travel', '/travel', '.travel-globe__canvas']]) {
    await page.goto(`http://127.0.0.1:5176${path}`);
    await page.locator(selector).waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    geometry[`${width}-${name}`] = await page.locator('.app-frame, .app-shell, .magazine-spread__page, .single-page-reader, .home-cover, .blog-title, .travel-globe-stage, .travel-globe__zoom, .travel-globe__scale').evaluateAll(elements => elements.map(el => {
      const { x, y, width, height } = el.getBoundingClientRect();
      const css = getComputedStyle(el);
      return { className: el.className, x, y, width, height, font: css.font, background: css.backgroundColor };
    }));
    await page.screenshot({ path: fileURLToPath(new URL(`${width}-${name}.png`, destination)) });
  }
  await page.close();
}
await writeFile(new URL('geometry.json', destination), JSON.stringify(geometry, null, 2));
await browser.close();
console.log(`Captured ${Object.keys(geometry).length} layouts: ${destination.pathname}`);
