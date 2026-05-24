import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 当本地开发（npm run dev）发起 /api 请求时，Vite 会自动帮你不动声色地转发给本地的 Go 后端
      "/api": {
        target: "http://localhost:8090", // 👈 换成你本地 Go 后端跑的真实端口
        changeOrigin: true,
      },
    },
  },
});
