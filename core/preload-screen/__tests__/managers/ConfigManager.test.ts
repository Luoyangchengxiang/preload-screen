import { describe, it, expect, beforeEach } from 'vitest';
import { ConfigManager } from '../../src/managers/ConfigManager';
import type { PreloadConfig } from '../../src/types';

describe('ConfigManager', () => {
  /* 每次把 body 清干净，防止 ID 污染 */
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  /* ---------- 默认值/合并值 ---------- */
  it('未传参时走默认配置', () => {
    const cm = new ConfigManager();
    expect(cm.elId).toBe('body');   // 默认 config.elId 是 ""，走到 fallback
    expect(cm.minShow).toBe(300);
    expect(cm.fadeOut).toBe(500);
    expect(cm.mode).toBe('auto');
    expect(cm.text).toBe('Loading...');
    expect(cm.color).toBe('#1890ff');
    expect(cm.debug).toBe(false);
    expect(cm.logoConfig).toBe(null);
    expect(cm.animeStyle).toBe('spin');
  });

  it('用户配置覆盖默认', () => {
    const user: Partial<PreloadConfig> = {
      minShow: 1000,
      mode: 'manual',
      text: 'Please wait...',
      logoConfig: { src: 'logo.png' },
    };
    const cm = new ConfigManager(user);
    expect(cm.minShow).toBe(1000);
    expect(cm.mode).toBe('manual');
    expect(cm.text).toBe('Please wait...');
    expect(cm.logoConfig).toEqual({ src: 'logo.png' });
    // 其余保持默认
    expect(cm.fadeOut).toBe(500);
  });

  /* ---------- ensureElId 逻辑 ---------- */
  it('当 elId 为空且页面存在 #app 时自动选用', () => {
    document.body.innerHTML = '<div id="app"></div>';
    const cm = new ConfigManager({ elId: '' });
    expect(cm.elId).toBe('app');
  });

  it('当 elId 为空且页面存在 #root 时优先选用 #root', () => {
    document.body.innerHTML = '<div id="root"></div><div id="app"></div>';
    const cm = new ConfigManager({ elId: '' });
    expect(cm.elId).toBe('root');
  });

  it('当 elId 为空且找不到常用 ID 时 fallback 到 body', () => {
    document.body.innerHTML = '<div id="unknown"></div>';
    const cm = new ConfigManager({ elId: '' });
    expect(cm.elId).toBe('body');
  });

  it('用户显式传入 elId 时不走自动探测', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const cm = new ConfigManager({ elId: 'myApp' });
    expect(cm.elId).toBe('myApp');
  });

  /* ---------- update 方法 ---------- */
  it('update 可热更新部分配置', () => {
    const cm = new ConfigManager({ color: '#000' });
    expect(cm.color).toBe('#000');

    cm.update({ color: '#fff', text: 'Updated' });
    expect(cm.color).toBe('#fff');
    expect(cm.text).toBe('Updated');
    // 未更新的字段保持原样
    expect(cm.minShow).toBe(300);
  });
});
