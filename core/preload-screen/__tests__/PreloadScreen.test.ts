import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PreloadScreen } from '../src/PreloadScreen'; // 假设这是你的主文件名

describe('PreloadScreen', () => {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;

    // 在测试之间清除单例实例
    // @ts-ignore - 为测试目的访问私有财产
    PreloadScreen.instance = null;
  });


  describe('init()', () => {
    it('应该在第一次调用时创建一个新实例', () => {
      const instance1 = PreloadScreen.init({});
      const instance2 = PreloadScreen.init();

      expect(instance1).toBe(instance2);
    });

    it('如果已经初始化并提供选项，应该更新配置', () => {
      const initialOptions = { color: '#fff' };
      const updateOptions = { color: '#000' };

      const instance = PreloadScreen.init(initialOptions);
      const spy = vi.spyOn(instance as any, 'updateConfig');

      PreloadScreen.init(updateOptions);

      expect(spy).toHaveBeenCalledWith(updateOptions);
    });
  });
});