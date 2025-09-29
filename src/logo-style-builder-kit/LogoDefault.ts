import { LogoConfig } from "src/types";
import { isLogoConfigObject } from "src/utils/helpers";

export class DLogo {
  private readonly LogoClassName: string = 'chyk-default-logo';
  private logoConfig: LogoConfig | null = null;
  private wrapperLogo: HTMLElement | null = null;
  private logoSrc: string;
  constructor(private debug: boolean, private logo: string, private config: LogoConfig | null) {
    this.logoConfig = config;
    this.logoSrc = logo;
  }

  public create(): HTMLDivElement {
    this.setupDOM();
    return this.wrapperLogo as HTMLDivElement;
  }

  private setupDOM() {
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
      width: `${this.logoConfig?.width ?? 100}px`,
      height: `${this.logoConfig?.height ?? 100}px`,
      borderRadius: `${this.logoConfig?.rounded ?? 0}px`,
      marginBottom: `${this.logoConfig?.marginBottom ?? 12}px`,
      backgroundSize: this.logoConfig?.backgroundMode ?? 'cover',
    });

    this.wrapperLogo = wrapperLogo;
  }
}