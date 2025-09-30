/*
 * @Date: 2025-09-25 13:45:21
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-29 11:06:19
 * @FilePath: \preload-screen\src\managers\ConfigManager.ts
 */
import { handleUnits } from "src/utils/helpers";
import { config } from "../config";
import type { PreloadConfig, PreloadMode, LogoConfig, AnimeStyle } from "../types";

export class ConfigManager {
  private options: Required<PreloadConfig>;

  constructor(userOptions?: Partial<PreloadConfig>) {
    const merged = { ...config, ...userOptions };
    this.options = {
      elId: merged.elId ?? "",
      minShow: handleUnits(merged.minShow) ?? 300,
      fadeOut: handleUnits(merged.fadeOut) ?? 500,
      mode: merged.mode ?? "auto",
      maxAttempts: handleUnits(merged.maxAttempts) ?? 100,
      checkInterval: handleUnits(merged.checkInterval) ?? 50,
      text: merged.text ?? "Loading...",
      color: merged.color ?? "#1890ff",
      debug: merged.debug ?? false,
      animeStyle: merged.animeStyle ?? "spin",
      logo: merged.logo ?? "",
      logoConfig: merged.logoConfig ?? null,
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
  get maxAttempts() { return this.options.maxAttempts }
  get checkInterval() { return this.options.checkInterval }
  get text() { return this.options.text }
  get color() { return this.options.color }
  get debug() { return this.options.debug }
  get logo(): string { return this.options.logo }
  get logoConfig(): LogoConfig | null { return this.options.logoConfig }
  get animeStyle(): AnimeStyle { return this.options.animeStyle }
}
