import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LifecycleManager } from '../../src/managers/LifecycleManager';
import type { ConfigManager } from '../../src/managers/ConfigManager';
import type { DOMManager } from '../../src/managers/DOMManager';
import type { AnimationManager } from '../../src/managers/AnimationManager';
declare global {
  interface Window {
    preloadHide?: () => void;
  }
}
/* ---------- mock 依赖 ---------- */
const mockFadeOutAndRemove = vi.fn();
const mockDom = { fadeOutAndRemove: mockFadeOutAndRemove } as any;
const mockProgressDone = vi.fn();
const mockProgress = { done: mockProgressDone } as any;
const mockAnimation = {} as any;
const mockConfig = (overrides: Partial<ConfigManager> = {}) =>
({
  mode: 'auto',
  elId: 'app',
  minShow: 300,
  fadeOut: 500,
  debug: false,
  ...overrides,
} as ConfigManager);

/* ---------- mock MutationObserver ---------- */
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()
const MockMutationObserver = vi.fn(() => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
}))

/* ---------- 工具：快速推进定时器 ---------- */
function advance(ms: number) {
  vi.advanceTimersByTime(ms);
}

describe('LifecycleManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    document.body.innerHTML = '';
    // 清掉全局 API
    delete (window as any).preloadHide;
    vi.stubGlobal('MutationObserver', MockMutationObserver)
  });

  afterEach(() => {
    vi.useRealTimers();
    // 恢复全局 API，包含 MutationObserver
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  /* -------------------------------------------------- */
  it('构造时记录创建时间', () => {
    const now = Date.now();
    vi.setSystemTime(now);
    const lm = new LifecycleManager(mockConfig(), mockDom, mockProgress, mockAnimation);
    expect((lm as any).createdAt).toBe(now);
  });

  /* -------------------------------------------------- */
  describe('auto 模式 & MutationObserver', () => {
    it('元素初始存在，立即绑定 Observer', () => {
      const root = document.createElement('div');
      root.id = 'app';
      document.body.appendChild(root);
      new MutationObserver(vi.fn())
      new LifecycleManager(mockConfig(), mockDom, mockProgress, mockAnimation);

      expect(mockObserve).toHaveBeenCalledWith(root, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    });

    it('元素初始不存在，轮询 50ms/次，找到后绑定 Observer', () => {
      new MutationObserver(vi.fn())

      new LifecycleManager(mockConfig(), mockDom, mockProgress, mockAnimation);

      // 第 1 次轮询（50ms）没找到
      advance(50);
      expect(mockObserve).not.toHaveBeenCalled();

      // 现在插入元素
      const root = document.createElement('div');
      root.id = 'app';
      document.body.appendChild(root);

      // 第 2 次轮询（100ms）找到了
      advance(50);
      expect(mockObserve).toHaveBeenCalledOnce();
    });

    it('轮询 100 次仍未找到则放弃（debug 时打印警告）', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => { });
      const config = mockConfig({ debug: true });
      new LifecycleManager(config, mockDom, mockProgress, mockAnimation);

      advance(50 * 100); // 50ms * 100 次
      expect(consoleWarn).toHaveBeenCalledWith('[PreloadScreen] 未找到指定元素 #app');
      consoleWarn.mockRestore();
    });
  });

  /* -------------------------------------------------- */
  describe('事件 & 手动 API', () => {
    it('window 派发 app-ready 事件会触发 beforeHide', () => {
      const lm = new LifecycleManager(mockConfig(), mockDom, mockProgress, mockAnimation);
      const beforeHideSpy = vi.spyOn(lm, 'beforeHide');
      window.dispatchEvent(new Event('app-ready'));
      expect(beforeHideSpy).toHaveBeenCalledWith('app-ready');
    });

    it('给 window 挂载 preloadHide() 函数，调用后触发 beforeHide', () => {
      const lm = new LifecycleManager(mockConfig(), mockDom, mockProgress, mockAnimation);
      const beforeHideSpy = vi.spyOn(lm, 'beforeHide');
      expect(typeof window.preloadHide).toBe('function');

      window.preloadHide!();
      expect(beforeHideSpy).toHaveBeenCalledOnce();
      expect(beforeHideSpy).toHaveBeenCalledWith('preloadHide()');
    });
  });

  /* -------------------------------------------------- */
  describe('beforeHide & 最小展示时间', () => {
    it('已到达最小展示时间，立即调用 hide', () => {
      const lm = new LifecycleManager(mockConfig({ minShow: 0 }), mockDom, mockProgress, mockAnimation);
      vi.spyOn(lm as any, 'hide').mockImplementation(() => { });
      lm.beforeHide('test');
      advance(200)
      expect((lm as any).hide).toHaveBeenCalledOnce();
    });

    it('未到达最小展示时间，延时 hide', () => {
      const lm = new LifecycleManager(mockConfig({ minShow: 300 }), mockDom, mockProgress, mockAnimation);
      const hideSpy = vi.spyOn(lm as any, 'hide');
      lm.beforeHide('test');

      // 299 ms 时尚未调用
      advance(299);
      expect(hideSpy).not.toHaveBeenCalled();

      // 再推进 1 ms，触发 hide
      advance(1);
      expect(hideSpy).toHaveBeenCalledOnce();
    });

    it('重复调用 beforeHide 只会调度一次', () => {
      const lm = new LifecycleManager(mockConfig({ minShow: 300 }), mockDom, mockProgress, mockAnimation);
      const hideSpy = vi.spyOn(lm as any, 'hide');
      lm.beforeHide('first');
      lm.beforeHide('second'); // 应该被忽略

      advance(300);
      expect(hideSpy).toHaveBeenCalledOnce();
    });
  });

  /* -------------------------------------------------- */
  describe('hide', () => {
    it('调用 dom.fadeOutAndRemove 并传入配置 fadeOut 时长', () => {
      const lm = new LifecycleManager(mockConfig({ fadeOut: 888 }), mockDom, mockProgress, mockAnimation);
      (lm as any).hide();
      advance(200)
      expect(mockFadeOutAndRemove).toHaveBeenCalledWith(888);
    });

    it('重复调用 hide 不会重复移除', () => {
      const lm = new LifecycleManager(mockConfig(), mockDom, mockProgress, mockAnimation);
      (lm as any).hide();
      (lm as any).hide();
      advance(200)
      expect(mockFadeOutAndRemove).toHaveBeenCalledOnce();
    });
  });
});
