import { PDefault } from "../progress-bar-builder-kit";
import type { LogoConfig } from "src/types";
export class ProgressManager {
  private rendered: boolean = false;
  private instanceProg: PDefault | null = null;
  constructor(private debug: boolean, private color: string, private text?: string) { }

  render(progressEl: HTMLElement, style: string, config?: LogoConfig) {
    if (this.debug) { console.info(`[PreloadScreen] The currently selected progress style: ${style}`); }
    if (this.rendered) { return; }
    this.rendered = true;
    switch (style) {
      case 'xue':

        break;

      default:
        this.renderDefault(progressEl, style, config)
        break;
    }
  }

  private renderDefault(progressEl: HTMLElement, style?: string, config?: LogoConfig) {
    try {
      this.instanceProg = new PDefault(config);
      progressEl.appendChild(this.instanceProg.create())
    } catch (error) {
      if (this.debug) { console.error("[PreloadScreen] Failed to create default progress bar", error); }
    }
  }

  done() {
    try {
      this.instanceProg?.done()
    } catch (error) {
      if (this.debug) { console.error("[PreloadScreen] Failed to create default progress bar", error); }
    }
  }
}