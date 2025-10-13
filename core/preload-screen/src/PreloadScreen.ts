import "./css/style.css"
import type { PreloadConfig, DomRenderContext, LogoConfig } from "./types";
import { ConfigManager } from "./managers/ConfigManager";
import { DOMManager } from "./managers/DOMManager";
import { LogoManager } from "./managers/LogoManager";
import { ProgressManager } from "./managers/ProgressManager";
import { AnimationManager } from "./managers/AnimationManager";
import { LifecycleManager } from "./managers/LifecycleManager";

declare global {
  interface Window {
    preloadHide?: () => void;
  }
}
export class PreloadScreen {
  private static instance: PreloadScreen;

  private config: ConfigManager;
  private dom: DOMManager;
  private preloadLogo: LogoManager;
  private progress: ProgressManager;
  private animation: AnimationManager;
  private lifecycle: LifecycleManager;

  private constructor(options?: Partial<PreloadConfig>) {
    // 初始化配置
    this.config = new ConfigManager(options);

    // 初始化 DOM
    this.dom = new DOMManager(this.config);

    this.preloadLogo = new LogoManager(this.config.debug, this.config.logo, this.config.logoConfig);

    // 初始化进度管理器
    this.progress = new ProgressManager(
      this.config.debug,
      this.config.color,
      this.config.text
    );

    // 初始化动画管理器
    this.animation = new AnimationManager(
      this.config.debug,
      this.config.color,
      this.config.text
    );

    // 根据配置更新 DOM 元素
    this.updateDOM();

    // 生命周期控制（auto/manual 模式、hide 调度）
    this.lifecycle = new LifecycleManager(this.config, this.dom, this.progress, this.animation);

    if (this.config.debug) {
      console.log(
        `[PreloadScreen] constructed with config:`,
        this.config,
        performance.now()
      );
    }
  }

  /** 单例入口 */
  static init(options?: Partial<PreloadConfig>) {
    if (!PreloadScreen.instance) {
      PreloadScreen.instance = new PreloadScreen(options);
    } else if (options) {
      PreloadScreen.instance.updateConfig(options);
    }
    return PreloadScreen.instance;
  }

  /** 更新配置 */
  private updateConfig(options: Partial<PreloadConfig>) {
    const prevMode = this.config.mode;

    this.config.update(options);
    this.updateDOM();

    // 如果模式切换到 auto，需要重新绑定
    if (prevMode !== this.config.mode && this.config.mode === "auto") {
      this.lifecycle = new LifecycleManager(this.config, this.dom, this.progress, this.animation);
    }

    if (this.config.debug) {
      console.log(
        `[PreloadScreen] config updated:`,
        options,
        performance.now()
      );
    }
  }

  /** 更新 DOM （动画 / logo 显示） */
  private updateDOM() {
    const renderContext = {
      elements: this.dom.queryElements(),
      logoSrc: this.config.logo ?? '',
      config: this.config,
      debug: this.config.debug
    }

    if (!renderContext.elements) {
      if (renderContext.debug) {
        console.error("[PreloadScreen] preload elements not found", performance.now());
      }
      return;
    }

    if (renderContext.logoSrc) {
      this.renderLogo(renderContext);
    } else {
      this.renderAnimation(renderContext);
    }
  }

  private renderLogo(context: Required<DomRenderContext<ConfigManager>>) {
    const { logoEl, progressEl } = context.elements!;
    this.dom.showLogo(context.elements!);
    this.preloadLogo.render(logoEl, context.config.logoConfig, context.config.logoConfig?.mode);
    this.progress.render(progressEl, context.config.logoConfig?.progress?.mode, this.config.logoConfig);
  }

  private renderAnimation(context: DomRenderContext<ConfigManager>) {
    const { animeEl, textEl } = context.elements!;
    this.dom.showAnimation(context.elements!);
    this.animation.render(animeEl, textEl, context.config.animeStyle);
  }

  /** 手动隐藏 */
  public hide(reason?: string) {
    this.lifecycle.beforeHide(reason ?? "manual-hide");
  }
}
