/*
 * @Date: 2025-09-25 14:06:37
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 18:02:14
 * @FilePath: \sourceHTML\preload-screen\vite.config.ts
 */
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import libCss from "vite-plugin-libcss";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "PreloadScreen", // 必须，UMD/IIFE 全局变量名
      formats: ["es", "umd"],
      fileName: (format) => `preload-screen.${format}.js`,
    },
    rollupOptions: {
      // 不打包依赖（用户自己提供）
      external: [],
      output: {
        globals: {},
      },
    },
  },
  plugins: [
    // 生成 .d.ts 类型声明
    dts({
      // 输出目录统一放到 dist/types
      outDir: "dist/types",
      // 在 index.d.ts 中生成类型入口
      insertTypesEntry: true,
      // 确保生成的类型声明不会被 tree-shake 掉
      rollupTypes: true,
    }),
    libCss(),
  ],
});
