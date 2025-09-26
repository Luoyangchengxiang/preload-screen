// src/index.ts

import { PreloadScreen } from "./PreloadScreen";
import type { PreloadConfig } from "./types";

// 默认导出 PreloadScreen 类
export { PreloadScreen };

let userConfig: Partial<PreloadConfig> | undefined;

// 提供一个初始化函数，用户可快速创建实例
export function initPreloadScreen(options?: Partial<PreloadConfig>) {
  userConfig = options;
  return PreloadScreen.init(options);
}

setTimeout(() => {
  if (userConfig === undefined) {             // 用户根本没调用过
    initPreloadScreen();                      // 用默认配置跑
  }
}, 0);

// 类型导出，方便用户使用
export type { PreloadConfig };
