import "../css/logo-progress.css"
import type { LogoConfig, ProgressConfig } from "src/types";

export class PDefault {
  private readonly ProgClassName: string = 'chyk-default-progress-bar';
  private readonly ProgTextClassName: string = 'chyk-default-progress-text';
  private prog: number = 0;
  private maxProg: number = 99;
  private wrapperProgress: HTMLElement | null = null;
  private progressText: HTMLElement | null = null;
  private timer: NodeJS.Timeout | null = null;
  private config: ProgressConfig | undefined;
  constructor(config?: LogoConfig) {
    this.config = config?.progress;
  }
  public create(): HTMLDivElement {
    this.setupDOM();
    const progress = document.createElement('div');
    if (this.wrapperProgress) {
      progress.appendChild(this.wrapperProgress);
      // 文本元素存在且需要显示时才添加
      if (this.config?.isShowText && this.progressText) {
        progress.appendChild(this.progressText);
      }
      this.initProgress(); // 初始化进度（元素不存在时会跳过）
      this.tick(); // 开始更新进度（元素不存在时会跳过）
    }
    return progress;
  }

  private setupDOM() {
    const wrapperProgress = document.createElement('div');
    wrapperProgress.className = this.ProgClassName;
    if (this.config?.color) {
      wrapperProgress.style.background = this.config.color;
    }
    if (this.config?.stroke || this.config?.stroke === 0) {
      wrapperProgress.style.height = `${this.config.stroke}px`;
      wrapperProgress.style.borderRadius = `${this.config.stroke / 2}px`;
    }
    this.wrapperProgress = wrapperProgress;

    const progressText = document.createElement('div');
    progressText.className = this.ProgTextClassName;
    if (this.config?.textColor) {
      progressText.style.color = this.config.textColor;
    }
    if (this.config?.textSize) {
      progressText.style.fontSize = `${this.config.textSize}px`;
    }
    this.progressText = progressText;
    return { wrapperProgress, progressText };
  }

  private initProgress() {
    if (!this.wrapperProgress) return;
    this.wrapperProgress.style.width = `${this.prog}%`;
  }

  private setProgress(progressNumber: number) {
    if (!this.wrapperProgress) return;
    this.prog = progressNumber;
    this.wrapperProgress.style.width = `${this.prog}%`;
    if (this.config?.isShowText && this.progressText) {
      this.progressText.textContent = `${this.prog}%`;
    }
  }

  private tick() {
    if (!this.wrapperProgress || this.prog >= this.maxProg) {
      clearTimeout(this.timer!);
      return;
    };
    var gap: number = Math.random() * 6 + (100 - this.prog) * 0.05;
    const newProgress = Math.min(this.maxProg, Number((this.prog + gap).toFixed(2)));
    this.setProgress(newProgress);
    this.timer = setTimeout(() => this.tick(), 200 + Math.random() * 300);
  }

  // 真正结束条件
  done() {
    this.tick = () => { };
    this.setProgress(100);
  }

}