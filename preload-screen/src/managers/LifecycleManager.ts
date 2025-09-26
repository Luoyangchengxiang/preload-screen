/*
 * @Date: 2025-09-25 13:51:29
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 16:36:36
 * @FilePath: \sourceHTML\preload-screen\src\managers\LifecycleManager.ts
 * @Description: 1.绑定自动移除逻辑（auto 模式）
 * 2.监听 app-ready 或全局 window.preloadHide
 * 3.处理 hide 前的最小展示时间逻辑
 */
import type { ConfigManager } from "./ConfigManager";
import type { DOMManager } from "./DOMManager";
import type { AnimationManager } from "./AnimationManager";

export class LifecycleManager {
  private createdAt = Date.now();
  private removed = false;
  private autoBound = false;
  private hideScheduled = false;

  constructor(
    private config: ConfigManager,
    private dom: DOMManager,
    private animation: AnimationManager
  ) {
    this.bindAutoRemove();
  }

  /** 绑定自动移除逻辑 */
  private bindAutoRemove() {
    if (this.removed || this.autoBound) return;

    // 监听根元素变化
    const bindObserve = (root: HTMLElement) => {
      if (this.autoBound) return;
      this.autoBound = true;

      const observer = new MutationObserver(() => {
        const hasContent = root.textContent?.trim() !== "";
        if (hasContent) {
          observer.disconnect();
          this.beforeHide("content-loaded");
        }
      });

      observer.observe(root, { childList: true, subtree: true, characterData: true });
    };

    if (this.config.mode === "auto") {
      const el = document.getElementById(this.config.elId);
      if (el) {
        bindObserve(el);
      } else {
        let attempts = 0;
        const interval = setInterval(() => {
          const root = document.getElementById(this.config.elId);
          if (root) {
            clearInterval(interval);
            bindObserve(root);
          } else if (++attempts >= 100) {
            clearInterval(interval);
            if (this.config.debug) {
              console.warn(`[PreloadScreen] 未找到指定元素 #${this.config.elId}`);
            }
          }
        }, 50);
      }
    }

    // 支持 app-ready 事件
    window.addEventListener("app-ready", () => this.beforeHide("app-ready"), { once: true });

    // 提供手动 hide API
    if (!window.preloadHide) {
      window.preloadHide = () => this.beforeHide("preloadHide()");
    }
  }

  /** 隐藏前逻辑：保证最小展示时间 */
  public beforeHide(reason?: string) {
    if (this.config.debug) {
      console.log("[PreloadScreen] beforeHide:", reason);
    }

    if (this.removed || this.hideScheduled) return;

    const elapsed = Date.now() - this.createdAt;
    const wait = this.config.minShow - elapsed;
    this.hideScheduled = true;

    if (wait > 0) {
      setTimeout(() => this.hide(), wait);
    } else {
      this.hide();
    }
  }

  /** 真正隐藏元素 */
  private hide() {
    if (this.removed) return;
    this.removed = true;
    this.dom.fadeOutAndRemove(this.config.fadeOut);
  }
}
