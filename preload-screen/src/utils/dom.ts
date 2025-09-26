/*
 * @Date: 2025-09-25 11:15:30
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 16:56:49
 * @FilePath: \sourceHTML\preload-screen\src\utils\dom.ts
 */
import type { ConfigManager } from "../managers/ConfigManager";
export function handleElementVisible(instance: ConfigManager, visible: boolean, elementNode?: HTMLElement[]) {

  if (instance.debug) {
    console.log(`[PreloadScreen] handleElementVisible visible: ${visible}`, performance.now());
  }

  if (visible) {
    if (elementNode) {
      elementNode.forEach(node => {
        if (instance.debug) {
          console.log(`[PreloadScreen] show node: ${JSON.stringify(node)}`, performance.now());
        }
        node && node.classList.add("visible");
      });
    }
  } else {
    if (elementNode) {
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

  const animeEl = document.createElement('div');
  animeEl.className = 'chyk-view chyk-preload-anime';

  const textEl = document.createElement('div');
  textEl.className = 'chyk-view chyk-preload-text';
  textEl.textContent = instance.text;

  handleElementVisible(instance, false, [logoEl, animeEl, textEl])

  wrapper.appendChild(logoEl);
  wrapper.appendChild(animeEl);
  wrapper.appendChild(textEl);

  document.body.appendChild(wrapper);
  return wrapper;
}