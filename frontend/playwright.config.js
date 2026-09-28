import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Live sidebar previews render several WebGL scenes with software rendering in CI.
  timeout: process.env.CI ? 90000 : 30000,
  expect: { timeout: process.env.CI ? 15000 : 5000 },
  workers: process.env.CI ? 1 : 2,
  use: {
    baseURL: 'http://127.0.0.1:5177',
    viewport: { width: 1440, height: 900 },
    launchOptions: { args: ['--enable-unsafe-swiftshader'] },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --port 5177 --strictPort', url: 'http://127.0.0.1:5177', reuseExistingServer: false },
});
