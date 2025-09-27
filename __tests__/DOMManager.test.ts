/*
 * @Date: 2025-09-25 13:59:35
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-26 17:45:30
 * @FilePath: \preload-screen\__tests__\DOMManager.test.ts
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DOMManager } from '../src/managers/DOMManager';
import * as domUtils from '../src/utils/dom';
import * as helperUtils from '../src/utils/helpers';
vi.mock('../src/utils/dom', () => ({
  createDOM: vi.fn(),
  handleElementVisible: vi.fn(),
}));

vi.mock('../src/utils/helpers', () => ({
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
  beforeEach(() => {
    fakeRoot = document.createElement('div');
    fakeRoot.innerHTML = `
    <div class="chyk-view chyk-preload-anime"></div>
    <div class="chyk-view chyk-preload-text">加载中...</div>
    <div class="chyk-view chyk-preload-logo visible"></div>
  `;
    document.body.appendChild(fakeRoot);
    vi.mocked(domUtils.createDOM).mockReturnValue(fakeRoot);
    domManager = new DOMManager(mockConfigManager());
  });

  afterEach(() => {
    fakeRoot.remove();
    vi.clearAllMocks();
  });

  it('构造时调用 createDOM 并把节点存到 root', () => {
    expect(domUtils.createDOM).toHaveBeenCalledOnce();
    expect(domManager.getRoot()).toBe(fakeRoot);
  });

  it('queryElements 能拿到三个子元素', () => {
    const els = domManager.queryElements();
    expect(els).not.toBeNull();
    expect(els?.animeEl).toBeInstanceOf(HTMLElement);
    expect(els?.textEl).toBeInstanceOf(HTMLElement);
    expect(els?.logoEl).toBeInstanceOf(HTMLElement);

    expect(els!.animeEl.textContent?.trim()).toBe('');
    expect(els!.textEl.textContent?.trim()).toBe('加载中...');
    expect(els!.logoEl.classList.contains('visible')).toBe(true);
  });

  it('queryElements 缺失元素时返回 null', () => {
    fakeRoot.innerHTML = ''; // 全清空
    expect(domManager.queryElements()).toBeNull();
  });

  it('getLogoSrc 优先返回对象里的 src', () => {
    vi.mocked(helperUtils.isLogoConfigObject).mockReturnValueOnce(true);
    const mgr = new DOMManager(mockConfigManager({ logoConfig: { src: 'obj.png' } }));
    expect(mgr.getLogoSrc()).toBe('obj.png');
  });


  it('showLogo 把 logo 显出来，把 anime/text 藏起来，并设背景图', () => {
    const { animeEl, textEl, logoEl } = domManager.queryElements()!;
    domManager.showLogo(logoEl, animeEl, textEl, 'test.png');

    expect(domUtils.handleElementVisible).toHaveBeenCalledWith(
      expect.any(Object),
      true,
      [logoEl]
    );
    expect(domUtils.handleElementVisible).toHaveBeenCalledWith(
      expect.any(Object),
      false,
      [animeEl, textEl]
    );
    expect(logoEl.style.backgroundImage).toBe('url("test.png")');
  });

  it('showAnimation 反过来', () => {
    const { animeEl, textEl, logoEl } = domManager.queryElements()!;
    domManager.showAnimation(logoEl, animeEl, textEl);

    expect(domUtils.handleElementVisible).toHaveBeenCalledWith(
      expect.any(Object),
      false,
      [logoEl]
    );
    expect(domUtils.handleElementVisible).toHaveBeenCalledWith(
      expect.any(Object),
      true,
      [animeEl, textEl]
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
