/*
 * @Date: 2025-09-25 11:18:58
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-27 10:20:14
 * @FilePath: \preload-screen\src\animations\AnimeFlower.ts
 */

import type { FlowerConfig } from '../types';

export class AnimeFlower {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: FlowerConfig;
  private startTime = performance.now();

  constructor(canvas: HTMLCanvasElement, config?: Partial<FlowerConfig>) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法获取 2D context');
    this.ctx = ctx;
    this.config = Object.assign({
      petalCount: 10,
      innerRadius: 20,
      petalLength: 140,
      petalWidth: 70,
      rotationSpeed: 0.25,
      swaySpeed: 0.9,
      swayAngle: 0.35,
      petalColor: '#FF6B9A',
      petalSecondary: '#FFD1E0',
      centerColor: '#FFD166',
      blendMode: 'lighter',
    } as FlowerConfig, config || {});

    window.addEventListener('resize', () => this.fitToWindow());
    this.fitToWindow();
    requestAnimationFrame((t) => this.draw(t));
  }

  private fitToWindow() {
    const size = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8, 800);
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
    this.resize();
  }

  private resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private drawPetal(ctx: CanvasRenderingContext2D, length: number, width: number) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(width * 0.4, length * 0.2, width * 0.2, length * 0.55);
    ctx.quadraticCurveTo(width * 0.15, length * 0.8, 0, length);
    ctx.quadraticCurveTo(-width * 0.15, length * 0.8, -width * 0.2, length * 0.55);
    ctx.quadraticCurveTo(-width * 0.4, length * 0.2, 0, 0);
    ctx.closePath();
  }

  private draw(timestamp: number) {
    const t = (timestamp - this.startTime) / 1000;
    const w = this.canvas.width / (window.devicePixelRatio || 1);
    const h = this.canvas.height / (window.devicePixelRatio || 1);
    this.ctx.clearRect(0, 0, w, h);

    this.ctx.save();
    this.ctx.translate(w / 2, h / 2);
    const wholeAngle = t * this.config.rotationSpeed * 2 * Math.PI;
    this.ctx.rotate(wholeAngle);
    this.ctx.globalCompositeOperation = this.config.blendMode;

    for (let i = 0; i < this.config.petalCount; i++) {
      const angle = (i / this.config.petalCount) * Math.PI * 2;
      this.ctx.save();
      this.ctx.rotate(angle);
      this.ctx.translate(0, this.config.innerRadius);

      const sway = Math.sin(t * this.config.swaySpeed * 2 * Math.PI + i * 0.6) * this.config.swayAngle * (0.6 + 0.4 * Math.sin(i));
      this.ctx.rotate(sway);

      this.drawPetal(this.ctx, this.config.petalLength, this.config.petalWidth);
      const g = this.ctx.createLinearGradient(0, this.config.petalLength * 0.15, 0, this.config.petalLength);
      g.addColorStop(0, this.config.petalSecondary);
      g.addColorStop(1, this.config.petalColor);
      this.ctx.fillStyle = g;
      this.ctx.fill();

      this.ctx.save();
      this.ctx.globalAlpha = 0.28;
      this.ctx.scale(1, 0.9);
      this.ctx.fillStyle = '#ffffff';
      this.drawPetal(this.ctx, this.config.petalLength * 0.9, this.config.petalWidth * 0.9);
      this.ctx.fill();
      this.ctx.restore();

      this.ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      this.ctx.restore();
    }

    // 花心
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.config.innerRadius * 1.0, 0, Math.PI * 2);
    const cg = this.ctx.createRadialGradient(0, 0, this.config.innerRadius * 0.2, 0, 0, this.config.innerRadius * 1.4);
    cg.addColorStop(0, '#fff8d6');
    cg.addColorStop(0.5, this.config.centerColor);
    cg.addColorStop(1, '#ff9f3c');
    this.ctx.fillStyle = cg;
    this.ctx.fill();

    this.ctx.fillStyle = 'rgba(0,0,0,0.08)';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + t * 0.6;
      const r = this.config.innerRadius * (0.45 + 0.15 * Math.sin(t + i));
      this.ctx.beginPath();
      this.ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2 + Math.abs(Math.sin(t + i)) * 1.2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
    requestAnimationFrame((t2) => this.draw(t2));
  }
}
