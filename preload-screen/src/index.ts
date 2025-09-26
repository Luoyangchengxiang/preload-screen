
import "./css/style.css"
import { Anime3DBoxSpin } from "./js/anime/anime3DBoxSpin";
import { Flower } from "./js/anime/animeFlower";
import { config } from "./config";
import type { PreloadConfig, PreloadMode, LogoConfig, AnimeStyle } from "./types";

declare global {
  interface Window {
    preloadHide?: () => void;
  }
}

class PreloadScreen {
  private static instance: PreloadScreen; // 单例
  private elId: string; // 根元素容器id React为root，Vue为app
  private el: HTMLElement | null = null; // 加载元素
  private removed = false; // 是否已移除
  private MIN_SHOW_MS: number; // 显示时间
  private FADE_OUT_MS: number; // 淡出时间
  private createdAt: number; // 创建时间
  private mode: PreloadMode; // 模式 auto: 自动，manual: 手动
  private text: string; // 文案
  private color: string; // 加载环的颜色
  private debug: boolean; // 是否开启debug
  private autoBound = false; // 是否已绑定过mutation监听 避免重复绑定
  private hideScheduled = false; // 防止重复调用 hide

  private logoConfig: LogoConfig | string;
  private animeStyle: AnimeStyle;

  constructor(options?: Partial<PreloadConfig>) {
    const processedConfig = { ...config, ...options };

    this.elId = processedConfig.elId ?? 'root';
    this.MIN_SHOW_MS = processedConfig.minShow ?? 300;
    this.FADE_OUT_MS = processedConfig.fadeOut ?? 500;
    this.mode = (processedConfig.mode as PreloadMode) ?? 'manual';
    this.text = processedConfig.text ?? 'Loading...';
    this.color = processedConfig.color ?? '#1890ff';
    this.debug = processedConfig.debug ?? false;
    this.createdAt = Date.now();
    this.logoConfig = processedConfig.logoConfig ?? '';
    this.animeStyle = processedConfig.animeStyle ?? 'spin';

    this.createDOM();
    this.bindAutoRemove();

    if (this.debug) { console.log(`[PreloadScreen] constructor options: ${JSON.stringify(processedConfig)}`, performance.now()); }
  }
  public static init(options?: PreloadConfig) {
    if (options?.debug) { console.log(`[PreloadScreen] init setupInstance options: ${JSON.stringify(options)}`, performance.now()); }

    if (!PreloadScreen.instance) {
      PreloadScreen.instance = new PreloadScreen(options);
    } else if (options) {
      PreloadScreen.instance.setupConfig(options);
    }
    return PreloadScreen.instance;
  }

  private handleElementVisible(visible: boolean, elementNode?: HTMLElement[]) {
    if (this.debug) { console.log(`[PreloadScreen] handleElementVisible visible: ${visible}`, performance.now()); }
    if (visible) {
      if (elementNode) {
        elementNode.forEach(node => {
          if (this.debug) { console.log(`[PreloadScreen] show node: ${node}`, performance.now()); }
          node && node.classList.add("visible");
        });
      }
    } else {
      if (elementNode) {
        elementNode.forEach(node => {
          if (this.debug) { console.log(`[PreloadScreen] hide node: ${node}`, performance.now()); }
          node && node.classList.remove("visible");
        });
      }
    }
  }
  /**
   * 更新配置参数
   * @description: 接收用户传递的配置参数并更新默认配置
   * @param {Partial<PreloadConfig>} options
   * @returns {void}
   * @private
   */
  private updateBasicConfig(options: Partial<PreloadConfig>): void {
    if (options.debug) { console.log(`[PreloadScreen] setupConfig prevMode: ${this.mode}`, performance.now()); }
    this.elId = options.elId ?? this.elId;
    this.MIN_SHOW_MS = options.minShow ?? this.MIN_SHOW_MS;
    this.FADE_OUT_MS = options.fadeOut ?? this.FADE_OUT_MS;
    this.mode = (options.mode as PreloadMode) ?? this.mode;
    this.text = options.text ?? this.text;
    this.color = options.color ?? this.color;
    this.debug = options.debug ?? this.debug;
    this.logoConfig = options.logoConfig ?? this.logoConfig;
    this.animeStyle = options.animeStyle ?? this.animeStyle;
    if (options.debug) { console.log(`[PreloadScreen] setupConfig options: ${JSON.stringify(options)}`, performance.now()); }
  }

  /**
   * 分配DOM元素
   * @description: 根据传入的内容，展示不同的DOM元素
   * @return {void}
   * @private
   */
  private updateDOMElements(): void {
    if (!this.el) return;
    const elements = this.queryPreloadElements();
    if (!elements) {
      if (this.debug) { console.error(`[PreloadScreen] Failed to obtain the loading element`, performance.now()); }
      return;
    }

    const { animeEl, textEl, logoEl } = elements;
    const logoSrc = this.getLogoSrc();

    if (logoSrc) {
      this.setupLogoDisplay(logoEl, animeEl, textEl, logoSrc);
    } else {
      if (this.debug) { console.log(`[PreloadScreen] not set logo src`, performance.now()); }
      this.setupAnimationDisplay(logoEl, animeEl, textEl);
    }
  }

  /**
   * 获取页面DOM元素
   * @description: 获取DOM容器并返回，包含三个元素的对象；任一元素缺失则返回 null
   * @return {{ animeEl: HTMLElement, textEl: HTMLElement, logoEl: HTMLElement } | null}
   * @private
   */
  private queryPreloadElements(): { animeEl: HTMLElement; textEl: HTMLElement; logoEl: HTMLElement; } | null {
    const animeEl = this.el?.querySelector<HTMLElement>('.chyk-preload-anime');
    const textEl = this.el?.querySelector<HTMLElement>('.chyk-preload-text');
    const logoEl = this.el?.querySelector<HTMLElement>('.chyk-preload-logo');

    if (logoEl && animeEl && textEl) {
      return { animeEl, textEl, logoEl };
    }
    return null;
  }

  /**
   * 获取logo值
   * @description: 通过logoConfig获取logo值
   * @return {string|undefined}
   * @private
   */
  private getLogoSrc(): string | undefined {
    if (typeof this.logoConfig === 'object' && this.logoConfig.src) {
      return this.logoConfig.src;
    } else if (typeof this.logoConfig === 'string') {
      return this.logoConfig;
    }
    return undefined;
  }

  /**
   * 配置logo样式的显示与隐藏
   * @description: 当传入logoConfig时，logoEl显示logoSrc，animeEl隐藏，textEl隐藏
   * @private
   * @todo: 待完善
   * @param {HTMLElement} logoEl
   * @param {HTMLElement} animeEl
   * @param {HTMLElement} textEl
   * @param {string} logoSrc
   * @return {void}
   */
  private setupLogoDisplay(logoEl: HTMLElement, animeEl: HTMLElement, textEl: HTMLElement, logoSrc: string): void {
    if (this.debug) { console.log(`[PreloadScreen] setup logo src: ${logoSrc}`, performance.now()); }

    this.handleElementVisible(true, [logoEl]);
    this.handleElementVisible(false, [animeEl, textEl]);

    try {
      logoEl.style.backgroundImage = `url(${CSS.escape(logoSrc)})`;
    } catch (error) {
      logoEl.style.backgroundImage = `url(${logoSrc})`;
    }
  }

  /**
   * 配置加载动画
   * @description: 根据传入的配置参数，创建加载动画元素
   * @private
   * @param {HTMLElement} logoEl
   * @param {HTMLElement} animeEl
   * @param {HTMLElement} textEl
   * @return {void}
   */
  private setupAnimationDisplay(logoEl: HTMLElement, animeEl: HTMLElement, textEl: HTMLElement): void {
    this.handleElementVisible(false, [logoEl]);
    this.handleElementVisible(true, [animeEl, textEl]);
    if (this.debug) { console.log(`[PreloadScreen] setup animeStyle: ${this.animeStyle}`, performance.now()); }
    switch (this.animeStyle) {
      case '3dBox':
        this.setup3DBoxAnimation(animeEl);
        break;
      case 'petal':
        this.setupPetalAnimation(animeEl);
        break;
      default:
        this.setupDefaultAnimation(animeEl, textEl);
        break;
    }
  }

  /**
   * 3DBox动画
   * @description: 创建一个3D盒子旋转动画，并添加到动画容器中
   * @private
   * @param {HTMLElement} animeEl
   * @return {void}
   * @see {@link https://uiverse.io/bociKond/wise-bat-13}
   */
  private setup3DBoxAnimation(animeEl: HTMLElement): void {
    try {
      const anime3DBoxSpinDOM = new Anime3DBoxSpin().create();
      animeEl.classList.add("chyk-p-30")
      animeEl.appendChild(anime3DBoxSpinDOM);
    } catch (e) {
      if (this.debug) { console.error('[PreloadScreen] Failed to create 3D box animation', e); }
    }
  }

  /**
   * 花瓣动画
   * @description: 一个不怎么好看的canvas动画
   * @param {HTMLElement} animeEl
   * @return {void}
   */
  private setupPetalAnimation(animeEl: HTMLElement): void {
    try {
      const canvas = document.createElement('canvas');
      animeEl.appendChild(canvas);
      new Flower(canvas);
    } catch (e) {
      if (this.debug) { console.error('[PreloadScreen] Failed to create petal animation', e); }
    }
  }

  /**
   * 默认旋转动画
   * @param {HTMLElement} animeEl
   * @param {HTMLElement} textEl
   * @return {void}
   */
  private setupDefaultAnimation(animeEl: HTMLElement, textEl: HTMLElement): void {
    animeEl.style.borderTopColor = this.color;
    animeEl.classList.add(`chyk-anime-${this.animeStyle}`);
    textEl.textContent = this.text;
  }

  /**
   * @description: 处理模式切换后的逻辑
   * @param {PreloadMode} prevMode
   * @param {Partial} options
   * @return {void}
   */
  private handleModeChange(prevMode: PreloadMode, options: Partial<PreloadConfig>): void {
    if (prevMode !== this.mode && this.mode === 'auto') {
      if (options.debug) { console.log(`[PreloadScreen] setupConfig PreloadModeChange. So run bindAutoRemove.`, performance.now()); }
      this.bindAutoRemove();
    }
  }
  private setupConfig(options: Partial<PreloadConfig>) {
    const prevMode = this.mode;
    this.updateBasicConfig(options);
    this.updateDOMElements();
    this.handleModeChange(prevMode, options);
  }

  private createDOM() {
    const wrapper = document.createElement('div');
    wrapper.id = 'chyk-preload-screen';

    const logoEl = document.createElement('div');
    logoEl.className = 'chyk-view chyk-preload-logo';

    const animeEl = document.createElement('div');
    animeEl.className = 'chyk-view chyk-preload-anime';

    const textEl = document.createElement('div');
    textEl.className = 'chyk-view chyk-preload-text';
    textEl.textContent = this.text;
    this.handleElementVisible(false, [logoEl]);
    this.handleElementVisible(true, [animeEl, textEl]);
    wrapper.appendChild(logoEl);
    wrapper.appendChild(animeEl);
    wrapper.appendChild(textEl);

    document.body.appendChild(wrapper);
    this.el = wrapper;
  }


  private bindAutoRemove() {
    let _that = this;
    if (_that.debug) { console.log(`[PreloadScreen] bindAutoRemove mode`, _that.mode, _that.mode === 'auto', performance.now()); }
    if (_that.removed || _that.autoBound) return;
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
      if (_that.autoBound) return;
      _that.autoBound = true;
      const stopObserving = observeContentChange(root, (hasContent: boolean) => {
        if (hasContent) {
          stopObserving();
          _that.beforeHide('stopObserving')
        }
      });
    }

    // 自动模式：资源加载完毕
    if (_that.mode === 'auto') {
      if (_that.debug) { console.log(`[PreloadScreen] bindAutoRemove root`, performance.now()); }
      const _root: HTMLElement | null = document.getElementById(_that.elId);
      if (_root) {
        // 启动监听，回调函数接收布尔值（true=有内容，false=空）
        _bindObserve(_root)
      } else {
        if (_that.debug) { console.warn(`[PreloadScreen] The specified element #${_that.elId} was not found. Wait for mounting...`); }
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
            if (_that.debug) { console.warn(`[PreloadScreen] 未找到指定元素 #${_that.elId}`); }
          }
        }, 50);
      }
    }
    // 用户自定义触发
    window.addEventListener('app-ready', () => _that.beforeHide('app-ready'), { once: true });

    if (!window.preloadHide) { window.preloadHide = () => _that.beforeHide('preloadHide()') };
  }

  public beforeHide(reason?: string) {
    if (this.debug) { console.log('[PreloadScreen] beforeHide:', reason); }
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