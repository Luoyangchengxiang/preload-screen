// src/index.ts

import { PreloadScreen } from "./PreloadScreen";
import type { PreloadConfig } from "./types";

// 类型导出，方便用户使用
export type { PreloadConfig };

// 默认导出 PreloadScreen 类
export { PreloadScreen };

let instance: PreloadScreen | null = null;
let userConfig: Partial<PreloadConfig> | undefined;

/**
 * 初始化 PreloadScreen
 * @param options - 传入的配置
 */
export function initPreloadScreen(options?: Partial<PreloadConfig>) {
  if (instance) {
    if (options?.debug) { console.warn("[PreloadScreen] 已经初始化过，将复用现有实例。"); }
    return instance;
  }
  userConfig = options;
  instance = PreloadScreen.init(options);
  return instance;
}

setTimeout(() => {
  if (userConfig === undefined) {             // 用户根本没调用过
    initPreloadScreen();                      // 用默认配置跑
  }
}, 0);


