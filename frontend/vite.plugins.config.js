import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { outDir: "plugin-dist", emptyOutDir: true, rollupOptions: { input: process.env.PLUGIN_ID ? `plugins/${process.env.PLUGIN_ID}/index.html` : undefined } },
});
