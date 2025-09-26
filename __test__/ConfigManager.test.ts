/*
 * @Date: 2025-09-25 13:59:30
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 14:47:03
 * @FilePath: \sourceHTML\preload-screen\__test__\ConfigManager.test.ts
 */
import { describe, it, expect } from 'vitest'; // 替换成 jest 也一样
import { ConfigManager } from '../src/managers/ConfigManager';

describe('ConfigManager', () => {
  it('should return default config when no user config provided', () => {
    const cfg = new ConfigManager({ text: "Hello" });
    expect(cfg.text).toBe("Hello");
    expect(cfg.elId).toBe("root");
  });

  it("should update options", () => {
    const cfg = new ConfigManager();
    cfg.update({ text: "New Text" });
    expect(cfg.text).toBe("New Text");
  });
});
