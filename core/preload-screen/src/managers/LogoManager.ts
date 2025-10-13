import "../css/logo.css"
import { DLogo, SVGLogo } from "../builders/logo-style-builder-kit";
import type { LogoConfig } from "../types";
export class LogoManager {
  private rendered: boolean = false;
  // private instanceLogo: LDefault | null = null;
  constructor(private debug: boolean, private logo: string, private config: LogoConfig | null) {
  }

  render(logoEl: HTMLElement, config: LogoConfig | null, mode?: string) {
    if (this.rendered) return;
    let anime = this.config?.anime;
    if (anime && logoEl) {
      switch (anime) {
        case 'asymptotic':
          logoEl.classList.add("chyk-anime-asymptotic")
          logoEl.classList.remove("chyk-anime-rotate", "chyk-anime-flicker");
          break;
        case 'rotate':
          logoEl.classList.add("chyk-anime-rotate")
          logoEl.classList.remove("chyk-anime-asymptotic", "chyk-anime-flicker");
          break;
        case 'flicker':
          logoEl.classList.add("chyk-anime-flicker")
          logoEl.classList.remove("chyk-anime-asymptotic", "chyk-anime-rotate");
          break;
        default:
          break;
      }
    }
    this.rendered = true;
    switch (mode) {
      case 'svg':
        this.renderSVG(logoEl, config);
        break;

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

  private renderSVG(logoEl: HTMLElement, config?: LogoConfig | null) {
    try {
      const svgLogo = new SVGLogo(this.debug, this.logo, this.config);
      logoEl.appendChild(svgLogo.create());
    } catch (error) {
      if (this.debug) { console.error("[PreloadScreen] Failed to create SVG logo", error); }
    }
  }

}