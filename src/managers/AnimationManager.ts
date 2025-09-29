/*
 * @Date: 2025-09-25 13:47:32
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-29 18:00:06
 * @FilePath: \preload-screen\src\managers\AnimationManager.ts
 */
import { Anime3DBoxSpin, AnimeFlower } from "../loading-anim-builder-kit";

export class AnimationManager {
  private rendered: boolean = false;
  constructor(private debug: boolean, private color: string, private text: string) { }

  render(animeEl: HTMLElement, textEl: HTMLElement, mode: string) {
    if (this.debug) { console.info(`[PreloadScreen] The currently selected animation: ${mode}`); }
    if (this.rendered) { return; }
    this.rendered = true;
    switch (mode) {
      case "3dBox":
        this.render3DBox(animeEl);
        break;
      case "petal":
        this.renderPetal(animeEl);
        break;
      default:
        this.renderDefault(animeEl, textEl, mode);
        break;
    }
  }

  private render3DBox(animeEl: HTMLElement) {
    try {
      animeEl.classList.add("chyk-p-30");
      const anime3DBox = new Anime3DBoxSpin();
      const anime3DBoxEl = anime3DBox.create();
      animeEl.appendChild(anime3DBoxEl);
    } catch (e) {
      if (this.debug) { console.error("[PreloadScreen] Failed to create 3D box animation", e); }
    }
  }

  private renderPetal(animeEl: HTMLElement) {
    try {
      const canvas = document.createElement('canvas');
      animeEl.appendChild(canvas);
      new AnimeFlower(canvas);
    } catch (e) {
      if (this.debug) { console.error('[PreloadScreen] Failed to create petal animation', e); }
    }
  }

  private renderDefault(animeEl: HTMLElement, textEl: HTMLElement, mode: string) {
    animeEl.style.borderTopColor = this.color;
    animeEl.classList.add(`chyk-anime-${mode}`);
    textEl.textContent = this.text;
  }
}
