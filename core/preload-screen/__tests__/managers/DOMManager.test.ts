/*
 * @Date: 2025-09-25 13:59:35
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-29 16:33:45
 * @FilePath: \preload-screen\__tests__\managers\DOMManager.test.ts
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DOMManager } from '../../src/managers/DOMManager';
import { ProgressManager } from '../../src/managers/ProgressManager';
import * as domUtils from '../../src/utils/dom';
vi.mock('../../src/utils/dom', () => ({
  createDOM: vi.fn(),
  handleElementVisible: vi.fn(),
}));

vi.mock('../../src/utils/helpers', () => ({
  isLogoConfigObject: vi.fn(() => true),
}));

function mockConfigManager(overrides = {}) {
  return {
    text: '加载中...',
    color: '#f99',
    ...overrides,
  } as any;
}

describe('DOMManager', () => {
  let fakeRoot: HTMLElement;
  let domManager: DOMManager;
  let progress: ProgressManager;
  beforeEach(() => {
    fakeRoot = document.createElement('div');
    fakeRoot.id = "root"
    fakeRoot.innerHTML = `
    <div class="chyk-view chyk-preload-anime"></div>
    <div class="chyk-view chyk-preload-text">加载中...</div>
    <div class="chyk-view chyk-preload-logo"></div>
    <div class="chyk-view chyk-preload-progress"></div>
  `;
    document.body.appendChild(fakeRoot);
    vi.mocked(domUtils.createDOM).mockReturnValue(fakeRoot);
    domManager = new DOMManager(mockConfigManager());
    progress = new ProgressManager(true, mockConfigManager().color);
  });

  afterEach(() => {
    fakeRoot.remove();
    vi.clearAllMocks();
  });

  it('构造时调用 createDOM 并把节点存到 body', () => {
    expect(domUtils.createDOM).toHaveBeenCalledOnce();
    expect(domManager.getRoot()).toBe(fakeRoot);
  });

  it('queryElements 能拿到四个子元素', () => {
    const els = domManager.queryElements();
    expect(els).not.toBeNull();
    expect(els?.animeEl).toBeInstanceOf(HTMLElement);
    expect(els?.textEl).toBeInstanceOf(HTMLElement);
    expect(els?.logoEl).toBeInstanceOf(HTMLElement);
    expect(els?.progressEl).toBeInstanceOf(HTMLElement);

    expect(els!.animeEl.textContent?.trim()).toBe('');
    expect(els!.textEl.textContent?.trim()).toBe('加载中...');
    expect(els!.logoEl.textContent?.trim()).toBe('');
    expect(els!.progressEl.textContent?.trim()).toBe('');
  });

  it('queryElements 缺失元素时返回 null', () => {
    fakeRoot.innerHTML = ''; // 全清空
    expect(domManager.queryElements()).toBeNull();
  });

  it('showLogo 把 logo/progress 显出来，把 anime/text 隐掉', () => {
    const elements = domManager.queryElements()!;
    domManager.showLogo(elements);

    expect(domUtils.handleElementVisible).toHaveBeenCalledWith(
      expect.any(Object),
      true,
      [elements.logoEl, elements.progressEl]
    );
    expect(domUtils.handleElementVisible).toHaveBeenCalledWith(
      expect.any(Object),
      false,
      [elements.animeEl, elements.textEl]
    );
  });

  it('showAnimation 反过来', () => {
    const elements = domManager.queryElements()!;
    domManager.showAnimation(elements);

    expect(domUtils.handleElementVisible).toHaveBeenCalledWith(
      expect.any(Object),
      false,
      [elements.logoEl, elements.progressEl]
    );
    expect(domUtils.handleElementVisible).toHaveBeenCalledWith(
      expect.any(Object),
      true,
      [elements.animeEl, elements.textEl]
    );
  });

  it('fadeOutAndRemove 会加 fade-out 类并在指定时间后移除节点', async () => {
    vi.useFakeTimers();
    domManager.fadeOutAndRemove(500);
    expect(fakeRoot.classList.contains('fade-out')).toBe(true);

    vi.advanceTimersByTime(499);
    expect(document.body.contains(fakeRoot)).toBe(true);

    vi.advanceTimersByTime(1);
    expect(document.body.contains(fakeRoot)).toBe(false);
    vi.useRealTimers();
  });

});
