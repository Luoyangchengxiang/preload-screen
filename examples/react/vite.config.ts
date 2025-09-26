/*
 * @Date: 2025-09-25 15:29:05
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 15:43:17
 * @FilePath: \sourceHTML\preload-screen\examples\react\vite.config.ts
 */
import { defineConfig } from "vite";
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      "@chyk/preload-screen": path.resolve(__dirname, '../../dist/preload-screen.es.js')
    }
  }
});
