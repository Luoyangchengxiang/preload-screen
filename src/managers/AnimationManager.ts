/*
 * @Date: 2025-09-25 13:47:32
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-29 11:05:34
 * @FilePath: \preload-screen\src\managers\AnimationManager.ts
 */
import { Anime3DBoxSpin, AnimeFlower } from "../loading-anim-builder-kit";

export class AnimationManager {
  private rendered: boolean = false;
  constructor(private debug: boolean, private color: string, private text: string) { }

  render(animeEl: HTMLElement, textEl: HTMLElement, style: string) {
    if (this.debug) { console.info(`[PreloadScreen] The currently selected animation: ${style}`); }
    if (this.rendered) { return; }
    this.rendered = true;
    switch (style) {
      case "3dBox":
        this.render3DBox(animeEl);
        break;
      case "petal":
        this.renderPetal(animeEl);
        break;
      default:
        this.renderDefault(animeEl, textEl, style);
        break;
    }
  }

  private render3DBox(animeEl: HTMLElement) {
    try {
      animeEl.classList.add("chyk-p-30")
      animeEl.appendChild(new Anime3DBoxSpin().create());
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

  private renderDefault(animeEl: HTMLElement, textEl: HTMLElement, style: string) {
    animeEl.style.borderTopColor = this.color;
    animeEl.classList.add(`chyk-anime-${style}`);
    textEl.textContent = this.text;
  }
}
