/*
 * @Date: 2025-09-25 11:15:30
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-10-11 13:54:52
 * @FilePath: \preload-screen\src\utils\dom.ts
 */
import type { ConfigManager } from "../managers/ConfigManager";
export function handleElementVisible(instance: ConfigManager, visible: boolean, elementNode: HTMLElement[]) {

  if (instance.debug) {
    console.log(`[PreloadScreen] handleElementVisible visible: ${visible}`, performance.now());
  }

  if (elementNode) {
    if (visible) {
      elementNode.forEach(node => {
        if (instance.debug) {
          console.log(`[PreloadScreen] show node: ${JSON.stringify(node)}`, performance.now());
        }
        node && node.classList.add("visible");
      });
    } else {
      elementNode.forEach(node => {
        if (instance.debug) {
          console.log(`[PreloadScreen] hide node: ${node}`, performance.now());
        }
        node && node.classList.remove("visible");
      });
    }
  }
}

export function createDOM(instance: ConfigManager): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.id = 'chyk-preload-screen';

  const logoEl = document.createElement('div');
  logoEl.className = 'chyk-view chyk-preload-logo';

  const logoProgress = document.createElement('div');
  logoProgress.className = 'chyk-view chyk-preload-progress';

  const animeEl = document.createElement('div');
  animeEl.className = 'chyk-view chyk-preload-anime';

  const textEl = document.createElement('div');
  textEl.className = 'chyk-view chyk-preload-text';
  textEl.textContent = instance.text;

  handleElementVisible(instance, false, [logoEl, logoProgress, animeEl, textEl])

  wrapper.appendChild(logoEl);
  wrapper.appendChild(logoProgress);
  wrapper.appendChild(animeEl);
  wrapper.appendChild(textEl);

  document.body.appendChild(wrapper);
  return wrapper;
}