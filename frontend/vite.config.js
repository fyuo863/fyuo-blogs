import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: "host-public-assets",
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "favicon.svg", source: readFileSync(new URL("./public/favicon.svg", import.meta.url)) });
      for (const fileName of ['fyuo-blogs.svg', 'fyuo-bot.svg', 'fyuo-ops.svg', 'fyuobot-ts.svg', 'fyuobot-ts-tools.svg', 'go-file-fetch.svg']) {
        this.emitFile({ type: 'asset', fileName, source: readFileSync(new URL(`./public/${fileName}`, import.meta.url)) });
      }
    },
  }],
  build: { copyPublicDir: false },
  server: {
    proxy: {
      // 当本地开发（npm run dev）发起 /api 请求时，Vite 会自动帮你不动声色地转发给本地的 Go 后端
      "/api": {
        target: process.env.BLOG_DEV_BACKEND || "http://localhost:8090",
        changeOrigin: true,
      },
      "/plugin-assets": { target: process.env.BLOG_DEV_BACKEND || "http://localhost:8090", changeOrigin: true },
      "/uploads": { target: process.env.BLOG_DEV_BACKEND || "http://localhost:8090", changeOrigin: true },
    },
  },
});
