import { LogoConfig } from "../types";
import { handleUnits } from "../utils/helpers";

export class DLogo {
  private readonly LogoClassName: string = 'chyk-default-logo';
  protected logoConfig: LogoConfig | null = null;
  protected wrapperLogo: HTMLElement | null = null;
  protected logoSrc: string;
  constructor(private debug: boolean, private logo: string, private config: LogoConfig | null) {
    this.logoConfig = config;
    this.logoSrc = logo;
  }

  public create(): HTMLDivElement {
    this.setupDOM();
    return this.wrapperLogo as HTMLDivElement;
  }

  protected setupDOM() {
    const wrapperLogo = document.createElement('div');
    wrapperLogo.className = this.LogoClassName;
    if (this.logoSrc) {
      try {
        wrapperLogo.style.backgroundImage = `url(${CSS.escape(this.logoSrc)})`;
      } catch {
        wrapperLogo.style.backgroundImage = `url(${this.logoSrc})`;
      }
    }
    Object.assign(wrapperLogo.style, {
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      width: `${handleUnits(this.logoConfig?.width) ?? 100}px`,
      height: `${handleUnits(this.logoConfig?.height) ?? 100}px`,
      borderRadius: `${handleUnits(this.logoConfig?.rounded) ?? 0}px`,
      marginBottom: `${handleUnits(this.logoConfig?.marginBottom) ?? 12}px`,
      backgroundSize: this.logoConfig?.backgroundMode ?? 'cover',
    });

    this.wrapperLogo = wrapperLogo;
  }
}