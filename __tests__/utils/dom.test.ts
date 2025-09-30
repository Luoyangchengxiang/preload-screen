import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { handleElementVisible, createDOM } from "../../src/utils/dom";

function mockConfigManager(overrides = {}) {
  return {
    debug: false,
    text: '加载中...',
    ...overrides,
  } as any;
}


describe("dom.js", () => {

  beforeEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = "";
  })

  it("handleElementVisible 是否正常添加和删除 visible 类名", () => {
    const wrapper = document.createElement("div");
    expect(wrapper.classList.contains("visible")).toBe(false);
    handleElementVisible(mockConfigManager(), true, [wrapper]);
    expect(wrapper.classList.contains("visible")).toBe(true);

    handleElementVisible(mockConfigManager(), false, [wrapper]);
    expect(wrapper.classList.contains("visible")).toBe(false);
  });

  it('传入空数组或 undefined 时不会抛错', () => {
    const instance = mockConfigManager()
    expect(() => handleElementVisible(instance, true, undefined)).not.toThrow()
    expect(() => handleElementVisible(instance, false, [])).not.toThrow()
  })

  it('debug=true 时打印 console.log（可选断言）', () => {
    const instance = mockConfigManager({ debug: true })
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { })
    const el = document.createElement('div')

    handleElementVisible(instance, true, [el])

    // 只断言是否被调用，不关注具体参数，避免性能数字变动
    expect(logSpy).toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('应该创建 4 个子节点并挂到 body，同时返回 wrapper', () => {
    const instance = mockConfigManager()
    const wrapper = createDOM(instance)

    // 返回值正确
    expect(wrapper.tagName).toBe('DIV')
    expect(wrapper.id).toBe('chyk-preload-screen')

    // 子节点顺序固定
    const [logo, progress, anime, text] = Array.from(wrapper.children) as HTMLElement[]
    expect(logo.className).toContain('chyk-preload-logo')
    expect(progress.className).toContain('chyk-preload-progress')
    expect(anime.className).toContain('chyk-preload-anime')
    expect(text.className).toContain('chyk-preload-text')
    expect(text.textContent).toBe('加载中...')

    // 已挂到 body
    expect(document.body.contains(wrapper)).toBe(true)
  })

  it('创建完成后 4 个子节点应该默认隐藏（不含 .visible）', () => {
    const instance = mockConfigManager()
    const wrapper = createDOM(instance)

    const children = Array.from(wrapper.children) as HTMLElement[]
    children.forEach(el => {
      expect(el.classList.contains('visible')).toBe(false)
    })
  })
});