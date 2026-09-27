import { test, expect } from '@playwright/test';
import { mockBusinessAPI, user } from './plugin-fixtures.mjs';

test('core plugins preserve the original DOM, animations and spread across aliases', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await mockBusinessAPI(page);
  await page.goto('/');
  await expect(page.locator('.home-cover')).toBeVisible();
  await expect(page.locator('.blog-title')).toBeVisible();
  await expect(page.locator('.travel-globe__canvas')).toHaveCount(1);
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('.magazine-spread__page')).toHaveCount(3);
  await page.locator('.home-cover').evaluate(el => { el.dataset.migrationIdentity = 'original'; });
  const title = page.locator('.blog-title');
  const before = await title.getAttribute('style');
  await expect.poll(() => title.getAttribute('style')).not.toBe(before);
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('button', { name: 'travel', exact: true }).click();
  await expect(page).toHaveURL(/\/p\/travel$/);
  await expect(page.locator('.magazine-spread__track')).toHaveAttribute('style', /-33\.333333%/);
  await expect(page.locator('.home-cover')).toHaveAttribute('data-migration-identity', 'original');
  await expect(page.locator('.travel-globe__zoom-input')).toBeVisible();
  await page.locator('.travel-globe__zoom-input').fill('2.5');
  await expect(page.locator('.travel-globe__scale output')).toHaveText('1,000 km');
  await page.locator('.travel-globe').focus();
  await page.keyboard.press('ArrowRight');
  await page.goBack();
  await expect(page.locator('.home-cover')).toHaveAttribute('data-migration-identity', 'original');
  expect(errors).toEqual([]);
});

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
  await page.getByRole('button', { name: 'menu', exact: true }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('button', { name: 'index', exact: true }).click();
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
  await expect(page.getByRole('button', { name: 'log-in.', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('user'))).toBe(null);
  await expect(page.locator('.blog-title')).toHaveAttribute('data-identity', 'mounted');
});

test('401 from a plugin editor invokes the host logout and sign-in flow', async ({ page }) => {
  await mockBusinessAPI(page, { signedIn: true });
  await page.route('**/api/v1/travel-places', route => route.request().method() === 'POST' ? route.fulfill({ status: 401, json: { error: 'expired' } }) : route.fallback());
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/travel?desk=new');
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
  await expect(page.locator('iframe')).toHaveAttribute('sandbox', 'allow-scripts');
  await expect(page.locator('iframe')).toHaveAttribute('src', '/plugin-assets/legacy/1.0.0/index.html');
  await expect(page.frameLocator('iframe').getByRole('heading')).toHaveText('Legacy page');
});

test('wide content-desk commands only open the addressed editor', async ({ page }) => {
  await mockBusinessAPI(page, { signedIn: true });
  await page.goto('/p/travel?desk=new');
  await expect(page.locator('.travel-place-editor')).toBeVisible();
  await expect(page.locator('.blog-title')).toBeVisible();
  await expect(page.locator('.article-sheet')).toHaveCount(0);
  await page.goto('/p/journal?desk=new');
  await expect(page.getByPlaceholder('Article title...')).toBeVisible();
  await expect(page.locator('.travel-globe__canvas')).toHaveCount(1);
  await expect(page.locator('.travel-place-editor')).toHaveCount(0);
});
