import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as JSXRuntime from 'react/jsx-runtime';
import * as Router from 'react-router-dom';

const shared = { react: React, 'react-dom': ReactDOM, 'react/jsx-runtime': JSXRuntime, 'react-router-dom': Router };

export default defineConfig({
  plugins: [
    {
      name: 'blog-plugin-shared-runtime',
      enforce: 'pre',
      resolveId(id) { if (id in shared) return `\0blog-host:${id}`; },
      load(id) {
        if (!id.startsWith('\0blog-host:')) return;
        const name = id.slice('\0blog-host:'.length);
        const exports = Object.keys(shared[name]).filter(key => key !== 'default' && /^[a-zA-Z_$][\w$]*$/.test(key));
        return `const runtime = globalThis.__FYUO_PLUGIN_HOST_V1__?.[${JSON.stringify(name)}];
          if (!runtime) throw new Error('Plugin requires blog host API v1');
          export default runtime.default || runtime;
          ${exports.map(key => `export const ${key} = runtime.${key};`).join('\n')}`;
      },
    },
    react(),
  ],
  base: './',
  build: {
    copyPublicDir: false,
    // Preserve calc() precision and the existing layout when loaded in dev too.
    cssMinify: false,
    lib: { entry: 'plugins/index/entry.jsx', formats: ['es'], fileName: () => 'entry.js', cssFileName: 'style' },
    outDir: 'plugin-dist',
    emptyOutDir: true,
  },
});
