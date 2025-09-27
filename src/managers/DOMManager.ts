/*
 * @Date: 2025-09-25 13:50:25
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-26 17:19:42
 * @FilePath: \preload-screen\src\managers\DOMManager.ts
 * @Description: 1.创建和维护 preload DOM 结构
 * 2.提供查询 DOM 元素的方法
 * 3.控制元素的显示与隐藏
 * 4.处理 logo 与动画的展示
 */
import { createDOM, handleElementVisible } from "../utils/dom";
import { isLogoConfigObject } from "../utils/helpers";
import type { ConfigManager } from "./ConfigManager";

export class DOMManager {
  private root: HTMLElement | null = null;

  constructor(private config: ConfigManager) {
    this.root = createDOM(this.config);
  }

  getRoot() {
    return this.root;
  }

  /** 查询 preload 内部元素 */
  queryElements(): { animeEl: HTMLElement; textEl: HTMLElement; logoEl: HTMLElement } | null {
    if (!this.root) return null;
    const animeEl = this.root.querySelector<HTMLElement>(".chyk-preload-anime");
    const textEl = this.root.querySelector<HTMLElement>(".chyk-preload-text");
    const logoEl = this.root.querySelector<HTMLElement>(".chyk-preload-logo");

    if (animeEl && textEl && logoEl) return { animeEl, textEl, logoEl };
    return null;
  }

  /** 获取 logo 的 src */
  getLogoSrc(): string | undefined {
    const logoConfig = this.config.logoConfig;
    if (isLogoConfigObject(logoConfig) && logoConfig.src) {
      return logoConfig.src;
    } else if (typeof logoConfig === "string") {
      return logoConfig;
    }
    return undefined;
  }

  /** 设置 logo 显示 */
  showLogo(logoEl: HTMLElement, animeEl: HTMLElement, textEl: HTMLElement, src: string) {
    handleElementVisible(this.config, true, [logoEl]);
    handleElementVisible(this.config, false, [animeEl, textEl]);
    try {
      logoEl.style.backgroundImage = `url(${CSS.escape(src)})`;
    } catch {
      logoEl.style.backgroundImage = `url(${src})`;
    }
  }

  /** 设置动画显示 */
  showAnimation(logoEl: HTMLElement, animeEl: HTMLElement, textEl: HTMLElement) {
    handleElementVisible(this.config, false, [logoEl]);
    handleElementVisible(this.config, true, [animeEl, textEl]);
  }

  /** 执行隐藏过渡 */
  fadeOutAndRemove(duration: number) {
    if (!this.root) return;
    this.root.classList.add("fade-out");
    setTimeout(() => this.root?.remove(), duration);
  }
}
