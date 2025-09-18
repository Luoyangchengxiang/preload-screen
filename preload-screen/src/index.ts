/*
 * @Date: 2025-09-18 13:55:36
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-18 14:55:47
 * @FilePath: \sourceHTML\eye-catching\src\index.ts
 */
import "./style.css"

class preloadScreen {
  private el: HTMLElement | null = null;

  constructor(options?: { color?: string; text?: string }) {
    this.init(options);
  }

  private init(options?: { color?: string; text?: string }) {
    const wrapper = document.createElement('div');
    wrapper.id = 'eye-catching';
    wrapper.innerHTML = `
      <div class="preload-spinner" style="border-top-color:${options?.color || '#1890ff'}"></div>
      <div class="preload-text">${options?.text || 'Loading...'}</div>
    `;
    document.body.appendChild(wrapper);
    this.el = wrapper;
  }

  hide() {
    if (this.el) {
      this.el.classList.add('fade-out');
      setTimeout(() => this.el?.remove(), 500);
    }
  }
}

export default preloadScreen;