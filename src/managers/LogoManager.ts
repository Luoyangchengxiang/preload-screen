import "../css/logo.css"
import { DLogo } from "../builders/logo-style-builder-kit";
import type { LogoConfig } from "../types";
export class LogoManager {
  private rendered: boolean = false;
  // private instanceLogo: LDefault | null = null;
  constructor(private debug: boolean, private logo: string, private config: LogoConfig | null) {
  }

  render(logoEl: HTMLElement, config: LogoConfig | null, mode?: string) {
    if (this.rendered) return;
    this.rendered = true;
    switch (mode) {
      // case 'svg':

      //   break;

      default:
        this.renderDefault(logoEl, config);
        break;
    }
  }

  private renderDefault(logoEl: HTMLElement, config?: LogoConfig | null) {
    try {
      const logo = new DLogo(this.debug, this.logo, this.config);
      logoEl.appendChild(logo.create());
    } catch (error) {
      if (this.debug) { console.error("[PreloadScreen] Failed to create default logo", error); }
    }
  }

}