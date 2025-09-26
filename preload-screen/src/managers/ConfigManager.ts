/*
 * @Date: 2025-09-25 13:45:21
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 16:35:07
 * @FilePath: \sourceHTML\preload-screen\src\managers\ConfigManager.ts
 */
import { config } from "../config";
import type { PreloadConfig, PreloadMode, LogoConfig, AnimeStyle } from "../types";

export class ConfigManager {
  private options: Required<PreloadConfig>;

  constructor(userOptions?: Partial<PreloadConfig>) {
    const merged = { ...config, ...userOptions };
    this.options = {
      elId: merged.elId ?? "",
      minShow: merged.minShow ?? 300,
      fadeOut: merged.fadeOut ?? 500,
      mode: merged.mode ?? "auto",
      text: merged.text ?? "Loading...",
      color: merged.color ?? "#1890ff",
      debug: merged.debug ?? false,
      logoConfig: merged.logoConfig ?? "",
      animeStyle: merged.animeStyle ?? "spin",
    };
    this.ensureElId();
  }

  private ensureElId() {
    if (!this.options.elId) {
      const commonIds = ["root", "app"];
      for (const id of commonIds) {
        if (document.getElementById(id)) {
          this.options.elId = id;
          break;
        }
      }
      if (!this.options.elId) {
        this.options.elId = "body"; // fallback
      }
    }
  }

  update(newOptions: Partial<PreloadConfig>) {
    this.options = { ...this.options, ...newOptions };
  }

  get elId() { return this.options.elId }
  get minShow() { return this.options.minShow }
  get fadeOut() { return this.options.fadeOut }
  get mode(): PreloadMode { return this.options.mode }
  get text() { return this.options.text }
  get color() { return this.options.color }
  get debug() { return this.options.debug }
  get logoConfig(): LogoConfig | string { return this.options.logoConfig }
  get animeStyle(): AnimeStyle { return this.options.animeStyle }
}
