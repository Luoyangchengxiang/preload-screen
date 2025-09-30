/*
 * @Date: 2025-09-25 14:07:04
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-30 14:45:34
 * @FilePath: \preload-screen\vitest.config.ts
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,        // 支持 describe/it/expect 全局函数
    environment: "jsdom", // DOM 测试需要 jsdom 环境
    setupFiles: ["./__tests__/vitest.setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
    include: ["__tests__/**/*.test.ts"], // 测试文件位置
    includeSource: ['src/**/*.ts'],// 把所有 ts 都当成源码转译
  },
  esbuild: {
    target: 'node18',   // 或 node16，按你实际版本
    // 把语法降级到 es2020 以下，readonly 会被擦掉
  },
});
