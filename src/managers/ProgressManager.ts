import "../css/logo-progress.css"
import { PDefault, PRainbow, PBar } from "../progress-bar-builder-kit";
import type { LogoConfig, ProgressStyle } from "../types";
export class ProgressManager {
  private rendered: boolean = false;
  private instanceProg: PDefault | null = null;
  constructor(private debug: boolean, private color: string, private text?: string) { }

  render(progressEl: HTMLElement, mode: ProgressStyle | undefined, config?: LogoConfig | null) {
    if (this.debug) { console.info(`[PreloadScreen] The currently selected progress style: ${mode}`); }
    if (this.rendered) { return; }
    this.rendered = true;
    switch (mode) {
      case 'bar':
        this.renderBar(progressEl, config);
        break;
      case 'rainbow':
        this.renderRainbow(progressEl, config);
        break;
      default:
        this.renderDefault(progressEl, config)
        break;
    }
  }

  private renderDefault(progressEl: HTMLElement, config?: LogoConfig | null) {
    try {
      this.instanceProg = new PDefault(config);
      progressEl.appendChild(this.instanceProg.create())
    } catch (error) {
      if (this.debug) { console.error("[PreloadScreen] Failed to create default progress bar", error); }
    }
  }

  private renderRainbow(progressEl: HTMLElement, config?: LogoConfig | null) {
    try {
      this.instanceProg = new PRainbow(config);
      progressEl.appendChild(this.instanceProg.create())
    } catch (error) {
      if (this.debug) { console.error("[PreloadScreen] Failed to create Rainbow progress bar", error); }
    }
  }

  private renderBar(progressEl: HTMLElement, config?: LogoConfig | null) {
    try {
      this.instanceProg = new PBar(config);
      progressEl.appendChild(this.instanceProg.create())
    } catch (error) {
      if (this.debug) { console.error("[PreloadScreen] Failed to create Bar progress bar", error); }
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