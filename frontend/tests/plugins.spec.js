import { test, expect } from '@playwright/test';
import { mockBusinessAPI, user } from './plugin-fixtures.mjs';

test('fullscreen plugin shell overlays content and preserves it when collapsed', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await mockBusinessAPI(page);
  await page.goto('/');
  await expect(page.locator('.home-cover')).toBeVisible();
  await expect(page.locator('.blog-title')).toHaveCount(0);
  await expect(page.locator('.plugin-shell__reader > iframe')).toHaveCount(0);
  await page.locator('.home-cover').evaluate(el => { el.dataset.identity = 'original'; });
  const before = await page.locator('.plugin-shell__canvas').boundingBox();
  expect(before).toEqual({ x: 0, y: 0, width: 1440, height: 900 });
  await page.screenshot({ path: 'test-results/shell-desktop.png' });
  await page.locator('.plugin-shell__canvas').click({ position: { x: 900, y: 800 } });
  await expect(page.locator('.plugin-sidebar')).toHaveAttribute('data-collapsed', 'true');
  await expect(page.locator('.plugin-sidebar__toggle')).toHaveCount(0);
  expect(await page.locator('.plugin-shell__canvas').boundingBox()).toEqual(before);
  await expect(page.locator('.home-cover')).toHaveAttribute('data-identity', 'original');
  await page.mouse.move(8, 45);
  await expect(page.locator('.plugin-sidebar')).toHaveAttribute('data-collapsed', 'false');
  const nav = page.getByRole('navigation', { name: '插件导航' });
  await nav.getByRole('link', { name: 'journal', exact: true }).click();
  await expect(page.locator('.blog-title')).toBeVisible();
  const title = page.locator('.blog-title');
  const style = await title.getAttribute('style');
  await expect.poll(() => title.getAttribute('style')).not.toBe(style);
  await nav.getByRole('link', { name: 'travel', exact: true }).click();
  await expect(page).toHaveURL(/\/p\/travel$/);
  await expect(nav.getByRole('link', { name: 'travel' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.travel-globe__zoom-input')).toBeVisible();
  await page.locator('.travel-globe__zoom-input').fill('2.5');
  await expect(page.locator('.travel-globe__scale output')).toHaveText('1,000 km');
  await page.goBack();
  await expect(page.locator('.blog-title')).toBeVisible();
  expect(errors).toEqual([]);
});

for (const width of [320, 375, 414, 768]) {
  test(`shell fits ${width}px with accessible floating controls`, async ({ page }) => {
    await mockBusinessAPI(page);
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await expect(page.locator('.home-cover')).toBeVisible();
    expect(await page.locator('.plugin-shell__canvas').boundingBox()).toEqual({ x: 0, y: 0, width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.getByRole('button', { name: 'log-in.', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: '浙ICP备2026038123号' })).toHaveAttribute('href', 'https://beian.miit.gov.cn/');
    await page.screenshot({ path: `test-results/shell-expanded-${width}.png` });
    await page.getByRole('link', { name: 'index', exact: true }).focus();
    await page.keyboard.press('Escape');
    await expect(page.locator('.plugin-sidebar')).toHaveAttribute('data-collapsed', 'true');
    await expect(page.getByRole('link', { name: 'index', exact: true })).toBeFocused();
    await expect.poll(async () => { const box = await page.locator('.plugin-sidebar__tab').first().boundingBox(); return box.x < 0 && box.x + box.width > 0; }).toBe(true);
    await page.screenshot({ path: `test-results/shell-${width}.png` });
  });
}

test('narrow screens, old routes, aliases and unknown plugin failures', async ({ page }) => {
  await mockBusinessAPI(page);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [path, selector] of [['/', '.home-cover'], ['/p/index', '.home-cover'], ['/blog', '.blog-title'], ['/p/journal', '.blog-title'], ['/travel', '.travel-globe__canvas'], ['/p/travel', '.travel-globe__canvas']]) {
    await page.goto(path);
    await expect(page.locator(selector)).toBeVisible();
    await expect(page.locator('.single-page-reader')).toHaveCount(1);
    await expect(page.locator('.magazine-spread')).toHaveCount(0);
  }
  await page.goto('/p/missing');
  await expect(page.getByRole('alert')).toHaveText('插件不可用');
  await page.getByRole('navigation', { name: '插件导航' }).getByRole('link', { name: 'index', exact: true }).click();
  await expect(page.locator('.home-cover')).toBeVisible();
});

test('journal search, Markdown portals and view identity remain intact', async ({ page }) => {
  const calls = await mockBusinessAPI(page);
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/p/journal');
  await page.getByPlaceholder('search.').fill('Migration');
  await page.getByPlaceholder('search.').press('Enter');
  await expect.poll(() => calls.some(call => call.path.endsWith('/articles/search'))).toBe(true);
  await page.getByText('Migration fixture', { exact: true }).first().click();
  await expect(page.locator('strong').filter({ hasText: 'Original formatting' })).toBeVisible();
  await expect.poll(() => calls.filter(call => call.path.endsWith('/view')).length).toBe(1);
  const view = calls.find(call => call.path.endsWith('/view'));
  expect(view.headers['x-visitor-id']).toBeTruthy();
  expect(view.headers['x-event-id']).toBeTruthy();
  expect(view.headers['x-content-path']).toBe('/blog/42');
  await page.getByRole('button', { name: 'back.', exact: true }).first().click();
  await page.locator('.journal-entry').getByRole('button', { name: 'Migration fixture', exact: true }).click();
  await expect.poll(() => calls.filter(call => call.path.endsWith('/view')).length).toBe(2);
  const nextView = calls.filter(call => call.path.endsWith('/view'))[1];
  expect(nextView.headers['x-visitor-id']).toBe(view.headers['x-visitor-id']);
  expect(nextView.headers['x-event-id']).not.toBe(view.headers['x-event-id']);
});

test('the existing content desk opens plugin editors with the host login and callbacks', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const calls = await mockBusinessAPI(page, { signedIn: true });
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/desk');
  await page.getByRole('button', { name: 'edit home.', exact: true }).click();
  await expect(page.locator('.home-editor')).toBeVisible();
  await page.goto('/p/travel?desk=new');
  await page.locator('.plugin-sidebar__select').first().focus();
  await page.keyboard.press('Escape');
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Kyoto');
  await page.getByRole('textbox', { name: 'Latitude', exact: true }).fill('35.0116');
  await page.getByRole('textbox', { name: 'Longitude', exact: true }).fill('135.7681');
  await page.getByRole('button', { name: 'add pin.', exact: true }).click();
  await expect.poll(() => calls.some(call => call.method === 'POST' && call.path.endsWith('/travel-places'))).toBe(true);
  const save = calls.find(call => call.method === 'POST' && call.path.endsWith('/travel-places'));
  expect(save.headers.authorization).toBe(`Bearer ${user.token}`);
  expect(JSON.parse(save.body)).toMatchObject({ name: 'Kyoto', latitude: 35.0116, longitude: 135.7681 });
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Updated Kyoto');
  await page.getByRole('button', { name: 'save pin.', exact: true }).click();
  await expect.poll(() => calls.some(call => call.method === 'PUT' && call.path.endsWith('/travel-places/5'))).toBe(true);
  await page.getByRole('button', { name: 'delete pin.', exact: true }).click();
  await expect.poll(() => calls.some(call => call.method === 'DELETE' && call.path.endsWith('/travel-places/5'))).toBe(true);
  await page.goto('/p/journal?desk=new');
  await expect(page.locator('.blog-page')).toBeVisible();
  await expect(page.locator('[contenteditable="true"], textarea').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('article create, cover upload, edit and delete use the original protected endpoints', async ({ page }) => {
  const calls = await mockBusinessAPI(page, { signedIn: true });
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/p/journal?desk=new');
  await page.getByPlaceholder('Article title...').fill('Created through plugin');
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'cover.png', mimeType: 'image/png', buffer: Buffer.from('fixture-image') });
  await expect(page.getByPlaceholder('Cover image URL...')).toHaveValue('/uploads/migration-test.png');
  await page.getByRole('button', { name: 'blog.', exact: true }).click();
  await page.getByRole('button', { name: 'save,', exact: true }).click();
  await expect.poll(() => calls.some(call => call.method === 'POST' && call.path.endsWith('/articles'))).toBe(true);
  const create = calls.find(call => call.method === 'POST' && call.path.endsWith('/articles'));
  expect(JSON.parse(create.body)).toMatchObject({ title: 'Created through plugin', cover_image: '/uploads/migration-test.png', stage: 'published', vol: 1 });
  expect(create.headers.authorization).toBe(`Bearer ${user.token}`);
  await page.goto('/blog?desk=edit&id=42');
  await page.getByPlaceholder('Article title...').fill('Edited through plugin');
  await page.getByRole('button', { name: 'blog.', exact: true }).click();
  await page.getByRole('button', { name: 'save,', exact: true }).click();
  await expect.poll(() => calls.some(call => call.method === 'PUT' && call.path.endsWith('/articles/42'))).toBe(true);
  await page.getByRole('button', { name: 'close', exact: true }).click();
  await page.getByRole('button', { name: 'blog.', exact: true }).click();
  await page.getByRole('button', { name: 'delete,', exact: true }).click();
  await expect.poll(() => calls.some(call => call.method === 'DELETE' && call.path.endsWith('/articles/42'))).toBe(true);
});

test('host sign-in and logout reach mounted plugins without remounting the page', async ({ page }) => {
  const calls = await mockBusinessAPI(page);
  await page.goto('/p/journal');
  await page.locator('.blog-title').evaluate(el => { el.dataset.identity = 'mounted'; });
  await page.getByRole('button', { name: 'log-in.', exact: true }).click();
  await page.getByPlaceholder('name-plz').fill('migration-test');
  await page.getByPlaceholder('and-psw').fill('fixture-password');
  await page.getByRole('button', { name: /UNLOCK THE DESK/ }).click();
  await expect(page.getByRole('button', { name: 'blog.', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'close', exact: true }).click();
  await page.getByRole('button', { name: '关闭登录窗口' }).click();
  await expect(page.locator('.blog-title')).toHaveAttribute('data-identity', 'mounted');
  expect(calls.find(call => call.path.endsWith('/signin')).method).toBe('POST');
  await page.getByRole('button', { name: 'blog.', exact: true }).click();
  await page.getByRole('button', { name: 'exit.', exact: true }).click();
  await page.mouse.move(8, 45);
  await expect(page.getByRole('button', { name: 'log-in.', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('user'))).toBe(null);
  await expect(page.locator('.blog-title')).toHaveAttribute('data-identity', 'mounted');
});

test('401 from a plugin editor invokes the host logout and sign-in flow', async ({ page }) => {
  await mockBusinessAPI(page, { signedIn: true });
  await page.route('**/api/v1/travel-places', route => route.request().method() === 'POST' ? route.fulfill({ status: 401, json: { error: 'expired' } }) : route.fallback());
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/travel?desk=new');
  await page.locator('.plugin-sidebar__select').first().focus();
  await page.keyboard.press('Escape');
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Kyoto');
  await page.getByRole('textbox', { name: 'Latitude', exact: true }).fill('35');
  await page.getByRole('textbox', { name: 'Longitude', exact: true }).fill('135');
  await page.getByRole('button', { name: 'add pin.', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'log-in.' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('user'))).toBe(null);
});

test('legacy iframe plugins stay sandboxed and receive no host credentials', async ({ page }) => {
  await mockBusinessAPI(page, { signedIn: true });
  await page.route('**/api/v1/plugins/legacy/manifest', route => route.fulfill({ json: { data: { id: 'legacy', name: 'Legacy', version: '1.0.0', type: 'iframe', entry: 'index.html' } } }));
  await page.route('**/plugin-assets/legacy/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Legacy page</h1>' }));
  await page.goto('/p/legacy');
  await expect(page.locator('.plugin-shell__reader > iframe')).toHaveAttribute('sandbox', 'allow-scripts');
  await expect(page.locator('.plugin-shell__reader > iframe')).toHaveAttribute('src', '/plugin-assets/legacy/1.0.0/index.html');
  await expect(page.frameLocator('.plugin-shell__reader > iframe').getByRole('heading')).toHaveText('Legacy page');
});

test('content-desk commands only mount the addressed plugin editor', async ({ page }) => {
  await mockBusinessAPI(page, { signedIn: true });
  await page.goto('/p/travel?desk=new');
  await expect(page.locator('.travel-place-editor')).toBeVisible();
  await expect(page.locator('.blog-title')).toHaveCount(0);
  await expect(page.locator('.article-sheet')).toHaveCount(0);
  await page.goto('/p/journal?desk=new');
  await expect(page.getByPlaceholder('Article title...')).toBeVisible();
  await expect(page.locator('.travel-globe__canvas')).toHaveCount(0);
  await expect(page.locator('.travel-place-editor')).toHaveCount(0);
});


test('published plugins appear in the sidebar and switching resets the reading position', async ({ page }) => {
  await mockBusinessAPI(page);
  await page.route('**/api/v1/plugins', route => route.fulfill({ json: { data: [...['index', 'journal', 'travel'].map(slug => ({ slug, name: slug })), { slug: 'extra', name: 'Extra plugin' }] } }));
  await page.route('**/api/v1/plugins/extra/manifest', route => route.fulfill({ json: { data: { id: 'extra', name: 'Extra', version: '1.0.0', type: 'iframe', entry: 'index.html' } } }));
  await page.route('**/plugin-assets/extra/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Extra plugin</h1>' }));
  await page.goto('/');
  await expect(page.locator('.home-cover')).toBeVisible();
  await page.locator('.plugin-shell__reader').evaluate(el => { el.scrollTop = 500; });
  const extra = page.getByRole('link', { name: 'Extra plugin' });
  // Hover can expand the rail and move the target after click's first
  // actionability check. Complete that user interaction before clicking.
  await extra.hover();
  await expect(page.locator('.plugin-sidebar')).toHaveAttribute('data-collapsed', 'false');
  await expect.poll(async () => (await extra.boundingBox())?.x).toBe(0);
  await extra.click();
  await expect(page).toHaveURL(/\/p\/extra$/);
  await expect(page.frameLocator('.plugin-shell__reader > iframe').getByRole('heading')).toHaveText('Extra plugin');
  expect(await page.locator('.plugin-shell__reader').evaluate(el => el.scrollTop)).toBe(0);
  await expect(page.getByRole('link', { name: 'Extra plugin' })).toHaveAttribute('aria-current', 'page');
  await expect.poll(async () => {
    const current = await page.getByRole('link', { name: 'Extra plugin' }).boundingBox();
    const inactive = await page.getByRole('link', { name: 'index', exact: true }).boundingBox();
    return current.width > inactive.width && current.height > inactive.height;
  }).toBe(true);
});


test('sidebar previews render live plugin content without nested shells or editor commands', async ({ page }) => {
  await mockBusinessAPI(page, { signedIn: true });
  await page.goto('/p/journal?desk=new');
  const home = page.frameLocator('iframe[title="index 实时预览"]');
  const journal = page.frameLocator('iframe[title="journal 实时预览"]');
  await expect(home.locator('.home-cover')).toBeVisible();
  await expect(journal.locator('.blog-title')).toBeVisible();
  await expect(journal.locator('.plugin-sidebar')).toHaveCount(0);
  await expect(journal.locator('.article-sheet')).toHaveCount(0);
  await expect(page.getByPlaceholder('Article title...')).toBeVisible();
  const title = journal.locator('.blog-title');
  const style = await title.getAttribute('style');
  await expect.poll(() => title.getAttribute('style')).not.toBe(style);
  await home.locator('.home-cover').evaluate(el => { el.dataset.previewIdentity = 'persistent'; });
  await page.getByRole('link', { name: 'journal', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(home.locator('.home-cover')).toHaveAttribute('data-preview-identity', 'persistent');
  await page.screenshot({ path: 'test-results/live-sidebar-collapsed.png' });
  await page.getByRole('link', { name: 'journal', exact: true }).press('Enter');
  await expect(page.locator('.plugin-sidebar')).toHaveAttribute('data-collapsed', 'false');
  await page.screenshot({ path: 'test-results/live-sidebar-expanded.png' });
});
