import { handleUnits } from "../../utils/helpers";
import { LogoConfig } from "../../types";

export class SVGLogo {
  private readonly LogoClassName: string = 'chyk-svg-logo';
  private logoConfig: LogoConfig | null = null;
  private logoSrc: string;
  private wrapperLogo: HTMLElement | null = null;
  constructor(private debug: boolean, private logo: string, private config: LogoConfig | null) {
    this.logoConfig = config;
    this.logoSrc = logo;
  }
  public create(): HTMLDivElement {
    this.setupDOM();
    return this.wrapperLogo as HTMLDivElement;
  }

  protected setupDOM() {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(this.logoSrc, "image/svg+xml");
    const svgEl = svgDoc.documentElement;
    svgEl.classList.add(this.LogoClassName);
    console.log(this.logoConfig, "==================");

    if (this.logoConfig?.width) svgEl.setAttribute("width", this.logoConfig.width.toString());
    if (this.logoConfig?.height) svgEl.setAttribute("height", this.logoConfig.height.toString());
    if (this.logoConfig?.color) svgEl.setAttribute("fill", this.logoConfig.color);

    svgEl.style.borderRadius = `${handleUnits(this.logoConfig?.rounded) ?? 0}px`;
    svgEl.style.overflow = "hidden";

    const wrapper = document.createElement("div");
    wrapper.style.width = svgEl.getAttribute("width") || "auto";
    wrapper.style.height = svgEl.getAttribute("height") || "auto";
    wrapper.appendChild(svgEl);
    this.wrapperLogo = wrapper;
  }
}