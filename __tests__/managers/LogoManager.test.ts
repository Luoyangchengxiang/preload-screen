import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LogoManager } from '../../src/managers/LogoManager';
import { DLogo } from '../../src/logo-style-builder-kit';

// 模拟 DLogo 类
vi.mock('../../src/logo-style-builder-kit', () => {
  return {
    DLogo: vi.fn().mockImplementation(() => {
      return {
        create: vi.fn().mockReturnValue(document.createElement('div'))
      };
    })
  };
});

describe('LogoManager 测试套件', () => {
  let logoManager: LogoManager;
  const mockDebug = false;
  const mockLogo = 'test-logo';
  const mockConfig = {};

  beforeEach(() => {
    // 重置模拟状态
    vi.clearAllMocks();
    logoManager = new LogoManager(mockDebug, mockLogo, mockConfig);
  });

  it('应该正确创建 LogoManager 实例', () => {
    expect(logoManager).toBeInstanceOf(LogoManager);
  });

  it('应该能够成功渲染默认 logo', () => {
    const logoEl = document.createElement('div');
    const config = {};

    logoManager.render(logoEl, config);

    expect(DLogo).toHaveBeenCalledWith(mockDebug, mockLogo, mockConfig);
    expect(logoEl.children.length).toBeGreaterThan(0);
  });

  it('应该在重复调用 render 时避免重复渲染', () => {
    const logoEl = document.createElement('div');
    const config = {};

    // 第一次调用
    logoManager.render(logoEl, config);
    const firstRenderChildrenCount = logoEl.children.length;

    // 第二次调用应该不会增加子元素
    logoManager.render(logoEl, config);
    const secondRenderChildrenCount = logoEl.children.length;

    expect(firstRenderChildrenCount).toBe(secondRenderChildrenCount);
  });

  it('应该在调试模式下输出错误日志', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    const errorLogoManager = new LogoManager(true, mockLogo, mockConfig);

    // 模拟 DLogo 抛出错误
    (DLogo as any).mockImplementationOnce(() => {
      throw new Error('模拟错误');
    });

    const logoEl = document.createElement('div');
    errorLogoManager.render(logoEl, {});

    expect(consoleErrorSpy).toHaveBeenCalledWith("[PreloadScreen] Failed to create default logo", expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});