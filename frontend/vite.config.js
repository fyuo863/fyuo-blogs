import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: "host-public-assets",
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "favicon.svg", source: readFileSync(new URL("./public/favicon.svg", import.meta.url)) });
    },
  }],
  build: { copyPublicDir: false },
  server: {
    proxy: {
      // 当本地开发（npm run dev）发起 /api 请求时，Vite 会自动帮你不动声色地转发给本地的 Go 后端
      "/api": {
        target: "http://localhost:8090", // 👈 换成你本地 Go 后端跑的真实端口
        changeOrigin: true,
      },
      "/plugin-assets": { target: "http://localhost:8090", changeOrigin: true },
      "/uploads": { target: "http://localhost:8090", changeOrigin: true },
    },
  },
});
