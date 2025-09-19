/*
 * @Date: 2025-09-18 13:55:36
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-19 11:07:24
 * @FilePath: \sourceHTML\preload-screen\src\index.ts
 */
import "./style.css"
import { config } from "./config.ts";
import type { PreloadConfig } from "./config.ts";

declare global {
  interface Window {
    preloadHide?: () => void;
  }
}

class PreloadScreen {
  private static instance: PreloadScreen; // 单例
  private elId: string; // 容器id React为root，Vue为app
  private el: HTMLElement | null = null; // 加载元素
  private removed = false; // 是否已移除
  private MIN_SHOW_MS: number; // 显示时间
  private FADE_OUT_MS: number; // 淡出时间
  private createdAt: number; // 创建时间
  private mode: 'auto' | 'manual'; // 模式 auto: 自动，manual: 手动
  private text: string; // 文案
  private color: string; // 加载环的颜色
  private debug: boolean; // 是否开启debug
  private autoBound = false; // 是否已绑定过mutation监听 避免重复绑定
  private hideScheduled = false; // 防止重复调用 hide

  constructor(options?: Partial<PreloadConfig>) {
    const processedConfig = { ...config, ...options };

    this.elId = processedConfig.elId ?? 'root';
    this.MIN_SHOW_MS = processedConfig.minShow ?? 300;
    this.FADE_OUT_MS = processedConfig.fadeOut ?? 500;
    this.mode = (processedConfig.mode as 'auto' | 'manual') ?? 'manual';
    this.text = processedConfig.text ?? 'Loading...';
    this.color = processedConfig.color ?? '#1890ff';
    this.debug = processedConfig.debug ?? false;
    this.createdAt = Date.now();

    this.createDOM();
    this.bindAutoRemove();
  }
  public static init(options?: PreloadConfig) {
    if (!PreloadScreen.instance) {
      PreloadScreen.instance = new PreloadScreen(options);
    } else if (options) {
      PreloadScreen.instance.setupConfig(options);
    }
    return PreloadScreen.instance;
  }

  private setupConfig(options: Partial<PreloadConfig>) {
    const prevMode = this.mode;
    this.elId = options.elId ?? this.elId;
    this.MIN_SHOW_MS = options.minShow ?? this.MIN_SHOW_MS;
    this.FADE_OUT_MS = options.fadeOut ?? this.FADE_OUT_MS;

    this.mode = (options.mode as 'auto' | 'manual') ?? this.mode;

    this.text = options.text ?? this.text;
    this.color = options.color ?? this.color;
    this.debug = options.debug ?? this.debug;

    if (this.el) {
      const spinner = this.el.querySelector<HTMLElement>('.chyk-preload-spinner');
      const textEl = this.el.querySelector<HTMLElement>('.chyk-preload-text');
      if (spinner) spinner.style.borderTopColor = this.color;
      if (textEl) textEl.textContent = this.text;
    }

    if (prevMode !== 'auto' && this.mode === 'auto') {
      this.bindAutoRemove();
    }
  }

  private createDOM() {
    const wrapper = document.createElement('div');
    wrapper.id = 'chyk-preload-screen';

    // wrapper.innerHTML = `
    //   <div class="chyk-preload-spinner" style="border-top-color:${this.color}"></div>
    //   <div class="chyk-preload-text">${this.text}</div>
    // `;
    const spinner = document.createElement('div');
    spinner.className = 'chyk-preload-spinner';
    spinner.style.borderTopColor = this.color;

    const textEl = document.createElement('div');
    textEl.className = 'chyk-preload-text';
    textEl.textContent = this.text;

    wrapper.appendChild(spinner);
    wrapper.appendChild(textEl);

    // ----------------------------

    document.body.appendChild(wrapper);
    this.el = wrapper;
  }


  private bindAutoRemove() {
    if (this.removed || this.autoBound) return;
    this.autoBound = true;
    let _that = this;

    // 监听内容变化的函数
    const observeContentChange = (element: HTMLElement, callback: (hasContent: boolean) => void) => {
      // 初始判断内容是否为空
      let isContentPresent: boolean = element.textContent?.trim() !== '';
      callback(isContentPresent);

      const observer: MutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
        mutations.forEach(() => {
          const newContentPresent: boolean = element.textContent?.trim() !== '';
          if (newContentPresent !== isContentPresent) {
            isContentPresent = newContentPresent;
            callback(isContentPresent); // 传递布尔值给回调
          }
        });
      });
      // 配置观察选项：监听子节点变化和子树变化（包括文本节点）
      const config: MutationObserverInit = {
        childList: true, // 监听直接子节点变化
        subtree: true,   // 监听所有后代节点变化
        characterData: true,// 监听文本节点内容变化
        characterDataOldValue: false
      };
      observer.observe(element, config);

      return (): void => observer.disconnect();
    }

    const _bindObserve = (root: HTMLElement) => {
      const stopObserving = observeContentChange(root, (hasContent: boolean) => {
        if (hasContent) {
          stopObserving();
          _that.beforeHide('stopObserving')
        }
      });
    }
    // 自动模式：资源加载完毕
    if (_that.mode === 'auto') {
      const _root: HTMLElement | null = document.getElementById(_that.elId);

      if (_root) {
        // 启动监听，回调函数接收布尔值（true=有内容，false=空）
        _bindObserve(_root)
      } else {
        if (_that.debug) console.warn(`[PreloadScreen] 未找到指定元素 #${_that.elId}, 等待挂载...`);
        let attempts = 0;
        const maxAttempts = 100; // 最大尝试次数
        // 轮询等待元素挂载
        const interval = setInterval(() => {
          const el = document.getElementById(_that.elId);
          if (el) {
            clearInterval(interval);
            _bindObserve(el)
          } else if (++attempts >= maxAttempts) {
            clearInterval(interval);
            if (_that.debug) console.warn(`[PreloadScreen] 未找到指定元素 #${_that.elId}`);
          }
        }, 50);
      }
    }
    // 用户自定义触发
    window.addEventListener('app-ready', () => _that.beforeHide('app-ready'), { once: true });

    if (!window.preloadHide) { window.preloadHide = () => _that.beforeHide('preloadHide()') };
  }

  public beforeHide(reason?: string) {
    if (this.debug) console.log('[PreloadScreen] beforeHide:', reason);
    if (this.removed || this.hideScheduled) return;
    const elapsed = Date.now() - this.createdAt;
    const wait = this.MIN_SHOW_MS - elapsed;
    this.hideScheduled = true;
    if (wait > 0) { setTimeout(() => this.hide(), wait); }
    else {
      this.hide();
    }
  }

  private hide() {
    if (this.removed) return;
    this.removed = true;
    if (this.el) {
      this.el.classList.add('fade-out');
      setTimeout(() => this.el?.remove(), this.FADE_OUT_MS);
    }
  }
}

PreloadScreen.init();
export default PreloadScreen;
export { PreloadScreen };