import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProgressManager } from '../../src/managers/ProgressManager';
import { PDefault, PRainbow, PBar } from '../../src/builders/progress-bar-builder-kit';
import { handleUnits } from '../../src/utils/helpers';

// 模拟依赖模块
vi.mock('../../src/utils/helpers', () => {
  return {
    handleUnits: vi.fn().mockImplementation((value) => {
      if (typeof value === 'string' && value.endsWith('px')) {
        return parseInt(value);
      }
      return value;
    })
  };
});

vi.mock('../../src/builders/progress-bar-builder-kit', () => {
  const mockProgressBar = {
    create: vi.fn().mockReturnValue(document.createElement('div')),
    done: vi.fn()
  };

  return {
    PDefault: vi.fn().mockImplementation(() => mockProgressBar),
    PRainbow: vi.fn().mockImplementation(() => mockProgressBar),
    PBar: vi.fn().mockImplementation(() => mockProgressBar)
  };
});

describe('ProgressManager 测试套件', () => {
  let progressManager: ProgressManager;
  const mockDebug = false;
  const mockColor = '#ff0000';
  const mockText = '加载中...';

  beforeEach(() => {
    vi.clearAllMocks();
    progressManager = new ProgressManager(mockDebug, mockColor, mockText);
  });

  it('应该正确创建 ProgressManager 实例', () => {
    expect(progressManager).toBeInstanceOf(ProgressManager);
  });

  it('应该能够成功渲染默认进度条', () => {
    const progressEl = document.createElement('div');
    const config = { width: '300px' };

    progressManager.render(progressEl, undefined, config);

    expect(handleUnits).toHaveBeenCalledWith(config.width);
    expect(PDefault).toHaveBeenCalledWith(config);
    expect(progressEl.children.length).toBeGreaterThan(0);
  });

  it('应该能够成功渲染彩虹进度条', () => {
    const progressEl = document.createElement('div');
    const config = { width: '300px' };

    progressManager.render(progressEl, 'rainbow', config);

    expect(handleUnits).toHaveBeenCalledWith(config.width);
    expect(PRainbow).toHaveBeenCalledWith(config);
    expect(progressEl.children.length).toBeGreaterThan(0);
  });

  it('应该能够成功渲染条形进度条', () => {
    const progressEl = document.createElement('div');
    const config = { width: '300px' };

    progressManager.render(progressEl, 'bar', config);

    expect(handleUnits).toHaveBeenCalledWith(config.width);
    expect(PBar).toHaveBeenCalledWith(config);
    expect(progressEl.children.length).toBeGreaterThan(0);
  });

  it('应该在重复调用 render 时避免重复渲染', () => {
    const progressEl = document.createElement('div');
    const config = { width: '300px' };

    // 第一次调用
    progressManager.render(progressEl, undefined, config);
    const firstRenderChildrenCount = progressEl.children.length;

    // 第二次调用应该不会增加子元素
    progressManager.render(progressEl, undefined, config);
    const secondRenderChildrenCount = progressEl.children.length;

    expect(firstRenderChildrenCount).toBe(secondRenderChildrenCount);
  });

  it('应该正确设置进度条容器宽度', () => {
    const progressEl = document.createElement('div');
    const config = { width: '500px' };

    progressManager.render(progressEl, undefined, config);

    expect(progressEl.style.width).toBe('500px');
  });

  it('应该在调试模式下输出进度条创建信息', () => {
    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => { });
    const debugProgressManager = new ProgressManager(true, mockColor, mockText);
    const progressEl = document.createElement('div');

    debugProgressManager.render(progressEl, 'bar', {});

    expect(consoleInfoSpy).toHaveBeenCalledWith('[PreloadScreen] The currently selected progress style: bar');

    consoleInfoSpy.mockRestore();
  });

  it('应该在调试模式下捕获并记录错误', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    const errorProgressManager = new ProgressManager(true, mockColor, mockText);

    // 模拟 PDefault 抛出错误
    (PDefault as any).mockImplementationOnce(() => {
      throw new Error('模拟错误');
    });

    const progressEl = document.createElement('div');
    errorProgressManager.render(progressEl, undefined, {});

    expect(consoleErrorSpy).toHaveBeenCalledWith("[PreloadScreen] Failed to create default progress bar", expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('应该能够正确执行完成动画', () => {
    const progressEl = document.createElement('div');
    progressManager.render(progressEl, undefined, {});

    // 执行完成动画
    progressManager.done();
    const instance = new PDefault();
    // 验证 done 方法被调用
    expect(instance.done).toHaveBeenCalled();
  });
});