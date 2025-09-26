/*
 * @Date: 2025-09-25 13:59:35
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 14:03:25
 * @FilePath: \sourceHTML\preload-screen\__test__\DOMManager.test.ts
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DOMManager } from '../src/managers/DOMManager';

describe('DOMManager', () => {
  let dom: DOMManager;

  beforeEach(() => {
    dom = new DOMManager();
    document.body.innerHTML = ''; // 保证干净的 DOM
  });

  afterEach(() => {
    dom.destroy();
    document.body.innerHTML = '';
  });

  it('should create element with className', () => {
    dom.create({ tag: 'div', className: 'flower' });
    const el = document.querySelector('.flower');
    expect(el).not.toBeNull();
  });

  it('should apply styles when creating element', () => {
    dom.create({ tag: 'div', style: { color: 'red' } });
    const el = document.querySelector('div');
    expect(el?.style.color).toBe('red');
  });

  it('should destroy created element', () => {
    dom.create({ tag: 'div', className: 'flower' });
    dom.destroy();
    const el = document.querySelector('.flower');
    expect(el).toBeNull();
  });
});
