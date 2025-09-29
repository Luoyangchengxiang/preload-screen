/*
 * @Date: 2025-09-25 13:50:25
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-29 11:06:41
 * @FilePath: \preload-screen\src\managers\DOMManager.ts
 * @Description: 1.创建和维护 preload DOM 结构
 * 2.提供查询 DOM 元素的方法
 * 3.控制元素的显示与隐藏
 * 4.处理 logo 与动画的展示
 */
import { createDOM, handleElementVisible } from "../utils/dom";
import type { ConfigManager } from "./ConfigManager";
import type { PreloadElements } from "../types";

export class DOMManager {
  private root: HTMLElement | null = null;


  constructor(private config: ConfigManager) {
    this.root = createDOM(this.config);
  }

  getRoot() {
    return this.root;
  }

  /** 查询 preload 内部元素 */
  queryElements(): PreloadElements | null {
    if (!this.root) return null;
    const animeEl = this.root.querySelector<HTMLElement>(".chyk-preload-anime");
    const textEl = this.root.querySelector<HTMLElement>(".chyk-preload-text");
    const logoEl = this.root.querySelector<HTMLElement>(".chyk-preload-logo");
    const progressEl = this.root.querySelector<HTMLElement>(".chyk-preload-progress");

    if (animeEl && progressEl && textEl && logoEl) {
      return { animeEl, progressEl, textEl, logoEl }
    };
    return null;
  }

  /** 设置 logo 显示 */
  showLogo(elements: PreloadElements) {
    const { animeEl, progressEl, textEl, logoEl } = elements;
    handleElementVisible(this.config, true, [logoEl, progressEl]);
    handleElementVisible(this.config, false, [animeEl, textEl]);
  }

  /** 设置动画显示 */
  showAnimation(elements: PreloadElements) {
    const { animeEl, progressEl, textEl, logoEl } = elements;
    handleElementVisible(this.config, false, [logoEl, progressEl]);
    handleElementVisible(this.config, true, [animeEl, textEl]);
  }

  /** 执行隐藏过渡 */
  fadeOutAndRemove(duration: number) {
    if (!this.root) return;
    this.root.classList.add("fade-out");
    const safeDuration = Math.max(duration, 16);
    setTimeout(() => this.root?.remove(), safeDuration);
  }
}
