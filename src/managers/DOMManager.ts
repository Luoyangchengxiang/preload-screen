/*
 * @Date: 2025-09-25 13:50:25
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-28 16:54:37
 * @FilePath: \preload-screen\src\managers\DOMManager.ts
 * @Description: 1.创建和维护 preload DOM 结构
 * 2.提供查询 DOM 元素的方法
 * 3.控制元素的显示与隐藏
 * 4.处理 logo 与动画的展示
 */
import { createDOM, handleElementVisible } from "../utils/dom";
import { isLogoConfigObject } from "../utils/helpers";
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

  private setupLogoStyle(logoEl: HTMLElement) {
    const logoConfig = this.config.logoConfig;
    // 公共样式（无论logoConfig是对象还是字符串都生效）
    const baseStyles = {
      backgroundSize: "cover",
      marginBottom: "12px"
    };

    // 基础样式默认值（字符串类型时使用）
    const defaultStyle = {
      height: "150px",
      width: "150px",
      borderRadius: "0px"
    };

    // 根据logoConfig类型确定最终样式配置
    let styleConfig = { ...defaultStyle };
    let src = "";

    if (isLogoConfigObject(logoConfig)) {
      // 对象类型：用配置值覆盖默认值（支持可选属性）
      src = logoConfig.src;
      styleConfig = {
        height: logoConfig.height ?? defaultStyle.height,
        width: logoConfig.width ?? defaultStyle.width,
        borderRadius: logoConfig.rounded ?? defaultStyle.borderRadius
      };
    } else if (typeof logoConfig === "string") {
      // 字符串类型：直接使用默认样式
      src = logoConfig;
    }

    // 合并并设置所有样式（公共样式 + 动态样式）
    Object.assign(logoEl.style, baseStyles, styleConfig);

    // 处理背景图（带异常兼容）
    if (src) {
      try {
        logoEl.style.backgroundImage = `url(${CSS.escape(src)})`;
      } catch {
        logoEl.style.backgroundImage = `url(${src})`;
      }
    }
  }
  /** 设置 logo 显示 */
  showLogo(elements: PreloadElements) {
    const { animeEl, progressEl, textEl, logoEl } = elements;
    if (this.config.logoConfig) {
      this.setupLogoStyle(logoEl);
    }
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
