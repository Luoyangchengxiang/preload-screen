/*
 * @Date: 2025-09-25 14:07:04
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-26 16:50:45
 * @FilePath: \preload-screen\vitest.config.ts
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,        // 支持 describe/it/expect 全局函数
    environment: "jsdom", // DOM 测试需要 jsdom 环境
    coverage: {
      reporter: ["text", "json", "html"],
    },
    include: ["__tests__/**/*.test.ts"], // 测试文件位置
  },
});
