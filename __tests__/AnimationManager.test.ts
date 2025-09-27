// __tests__/AnimationManager.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { AnimationManager } from '../src/managers/AnimationManager';


vi.mock('../src/animations', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/animations')>()

  return {
    ...actual,                       // 先把原始所有导出原封不动带回来
    // 下面再“局部覆盖”你需要的几个构造器
    Anime3DBoxSpin: vi.fn(() => ({
      create: vi.fn(() => {
        const div = document.createElement('div')
        div.className = 'chyk-anime-3D-box-spin'
        return div
      }),
    })),
    AnimeFlower: vi.fn(),
  }
})




describe('AnimationManager', () => {
  let animeEl: HTMLElement;
  let textEl: HTMLElement;

  beforeEach(() => {
    vi.resetModules();
    animeEl = document.createElement('div');
    textEl = document.createElement('div');
  });

  afterEach(() => {
    vi.clearAllMocks();
  })

  it('new 一个实例不报错', () => {
    const mgr = new AnimationManager(false, '#ff0000', '加载中');
    expect(mgr).toBeDefined();
  });

  it('渲染 默认（spin） 动画分支时，把文本写进 textEl 并设置动画颜色', () => {
    const mgr = new AnimationManager(false, '#00ff00', '请稍候');
    mgr.render(animeEl, textEl, 'spin');
    expect(textEl.textContent).toBe('请稍候');
    expect(animeEl.style.borderTopColor).toMatch(/#00ff00|rgb\(0\s*,\s*255\s*,\s*0\)/);
  })

  it('渲染 3dBox 分支，在 animeEl 元素中插入 3dBox 动画', () => {
    const mgr = new AnimationManager(false, '', '');
    mgr.render(animeEl, textEl, '3dBox');
    expect(animeEl.querySelector('.chyk-anime-3D-box-spin')).toBeTruthy();
  })

  it('渲染 petal 分支，在 animeEl 元素中插入 canvas petal 动画', () => {
    const mgr = new AnimationManager(false, '', '');
    mgr.render(animeEl, textEl, 'petal');
    expect(animeEl.querySelector('canvas')).toBeTruthy();
  })

  it('3dBox 异常且 debug=true 时才打印错误', async () => {
    // 1. 强制模拟抛出错误
    const mockError = new Error('mock-3d-error');
    const { Anime3DBoxSpin } = vi.hoisted(() => ({
      Anime3DBoxSpin: vi.fn(() => ({
        create: vi.fn(() => { throw mockError; }),
      })),
    }));
    vi.doMock('../src/animations', () => ({
      Anime3DBoxSpin,
    }));
    const { AnimationManager } = await import('../src/managers/AnimationManager');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    const mgr = new AnimationManager(true, '', '');
    mgr.render(animeEl, textEl, '3dBox');
    expect(consoleSpy).toHaveBeenCalledWith('[PreloadScreen] Failed to create 3D box animation', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('petal 异常且 debug=true 时才打印错误', async () => {
    const mockError = new Error('mock-petal-error');
    const { AnimeFlower } = vi.hoisted(() => ({
      AnimeFlower: vi.fn(() => { throw mockError; }),
    }));
    vi.doMock('../src/animations', () => ({
      AnimeFlower,
    }));
    const { AnimationManager } = await import('../src/managers/AnimationManager');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    const mgr = new AnimationManager(true, '', '');
    mgr.render(animeEl, textEl, 'petal');

    expect(consoleSpy).toHaveBeenCalledWith(
      '[PreloadScreen] Failed to create petal animation',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });


});
