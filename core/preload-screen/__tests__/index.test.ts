// src/__tests__/index.test.ts
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initPreloadScreen, PreloadScreen } from '../src';
import type { PreloadConfig } from '../src/types';

// 为测试创建一个重置函数来清理模块状态
const resetModule = async () => {
  // 清理模块缓存
  const srcModulePath = `../src/index?t=${Date.now()}`;
  const mod = await import(srcModulePath);
  return mod;
};

function advance(ms: number) {
  vi.advanceTimersByTime(ms);
}

describe('index.ts', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // 每个测试前重置模块状态
    vi.resetModules();
    // 模拟 console.warn
    vi.spyOn(console, 'warn').mockImplementation(() => { });
  });

  afterEach(() => {
    vi.useRealTimers();
    // 恢复所有模拟
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  describe('总入口模块index', () => {
    it('应该在第一次调用时创建一个新的PreloadScreen实例', async () => {
      const { initPreloadScreen } = await import('../src');

      const instance1 = initPreloadScreen();
      expect(instance1.constructor.name).toBe('PreloadScreen');
      expect(instance1).not.toBeNull();
    });

    it('应该在后续调用中返回相同的实例', async () => {
      const { initPreloadScreen } = await import('../src');

      const instance1 = initPreloadScreen();
      const instance2 = initPreloadScreen();

      expect(instance1).toBe(instance2);
    });

    it('debug=true时，应该显示警告时调用多次', async () => {
      const { initPreloadScreen } = await import('../src');
      const consoleWarnSpy = vi.spyOn(console, 'warn');

      initPreloadScreen();
      initPreloadScreen({ debug: true });

      expect(consoleWarnSpy).toHaveBeenCalledWith('[PreloadScreen] 已经初始化过，将复用现有实例。');
    });

    it('debug=false或未定义时，不应该显示警告时调用多次', async () => {
      const { initPreloadScreen } = await import('../src');
      const consoleWarnSpy = vi.spyOn(console, 'warn');

      initPreloadScreen();
      initPreloadScreen({ debug: false });
      initPreloadScreen();

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('配置参数应该传递到：PreloadScreen.initPreloadScreen', async () => {
      const { initPreloadScreen, PreloadScreen } = await import('../src');
      const initSpy = vi.spyOn(PreloadScreen, 'init');
      const options: Partial<PreloadConfig> = { debug: true, fadeOut: 500 };

      initPreloadScreen(options);

      expect(initSpy).toHaveBeenCalledWith(options);
    });

    it('应该使用用户配置内容', async () => {
      const { initPreloadScreen } = await import('../src');
      const options: Partial<PreloadConfig> = { debug: true };

      initPreloadScreen(options);

      // 验证配置被存储（通过后续调用的行为间接验证）
      const consoleWarnSpy = vi.spyOn(console, 'warn');
      initPreloadScreen({ debug: true });
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe('自动初始化', () => {
    it('如果用户不调用，应该自动初始化默认配置', async () => {
      // 创建一个新的隔离环境来测试自动初始化
      const mod = await resetModule();
      const initSpy = vi.spyOn(mod.PreloadScreen, 'init');

      // 等待 setTimeout 执行
      advance(10)

      expect(initSpy).toHaveBeenCalledWith(undefined);
    });

    it('如果用户已经调用，不应该自动初始化 initPreloadScreen', async () => {
      const mod = await resetModule();
      const initSpy = vi.spyOn(mod.PreloadScreen, 'init');

      // 用户先调用初始化
      mod.initPreloadScreen({ debug: true });

      // 等待 setTimeout 执行
      advance(10)

      // 验证 PreloadScreen.initPreloadScreen 只被调用一次（用户调用的那次）
      expect(initSpy).toHaveBeenCalledTimes(1);
      expect(initSpy).toHaveBeenCalledWith({ debug: true });
    });
  });

  describe('exports', () => {
    it('应该导出PreloadScreen类', async () => {
      const { PreloadScreen } = await import('../src');
      expect(PreloadScreen).toBeDefined();
      expect(typeof PreloadScreen).toBe('function');
    });

    it('应该导出PreloadConfig类型', async () => {
      // 类型检查在编译时进行，这里只需验证是否能导入
      const mod = await import('../src');
      expect(mod).toBeDefined();
    });
  });
});