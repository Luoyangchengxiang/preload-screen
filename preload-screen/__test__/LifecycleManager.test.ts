/*
 * @Date: 2025-09-25 13:59:39
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 14:03:32
 * @FilePath: \sourceHTML\preload-screen\__test__\LifecycleManager.test.ts
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LifecycleManager } from '../src/managers/LifecycleManager';

describe('LifecycleManager', () => {
  let lifecycle: LifecycleManager;

  beforeEach(() => {
    lifecycle = new LifecycleManager();
  });

  it('should call init only once', () => {
    lifecycle.init();
    expect(lifecycle.initialized).toBe(true);

    // 再次调用不应重复初始化
    lifecycle.init();
    expect(lifecycle.initialized).toBe(true);
  });

  it('should start after init', () => {
    lifecycle.init();
    lifecycle.start();
    expect(lifecycle.running).toBe(true);
  });

  it('should stop after start', () => {
    lifecycle.init();
    lifecycle.start();
    lifecycle.stop();
    expect(lifecycle.running).toBe(false);
  });

  it('should destroy and cleanup', () => {
    lifecycle.init();
    lifecycle.start();
    lifecycle.destroy();
    expect(lifecycle.initialized).toBe(false);
    expect(lifecycle.running).toBe(false);
  });

  it('should not start if not initialized', () => {
    lifecycle.start();
    expect(lifecycle.running).toBe(false);
  });
});
