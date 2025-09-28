/*
 * @Date: 2025-09-25 15:29:18
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-28 13:50:07
 * @FilePath: \preload-screen\examples\vue\vite.config.ts
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // "@chyk/preload-screen": path.resolve(__dirname, '../../dist/preload-screen.es.js')
      "@chyk/preload-screen": path.resolve(__dirname, '../../src/index.ts')
    }
  }
});
