import { PDefault } from './ProgressDefault';
import type { LogoConfig } from '../types';

export class PBar extends PDefault {

  constructor(cfg?: LogoConfig | null) {
    super(cfg);
  }

  /* 1. 创建 DOM：父类节点拿过来，只改进度条背景 */
  protected override setupDOM() {
    const { wrapperProgress, progressText } = super.setupDOM();

    /* 蓝底白块斜杠 */
    wrapperProgress.style.background =
      'linear-gradient(-45deg, ' +
      'rgba(255,255,255,.35) 25%, transparent 25%, transparent 50%, ' +
      'rgba(255,255,255,.35) 50%, rgba(255,255,255,.35) 75%, transparent 75%, transparent)';
    wrapperProgress.style.backgroundSize = '40px 40px';   /* 方块大小 */
    wrapperProgress.style.backgroundColor = this.config?.color ?? '#1890ff';    /* 蓝色底色 */

    /* 让斜块向右移动 */
    wrapperProgress.style.animation = 'moveBar 1s linear infinite';

    return { wrapperProgress, progressText };
  }

  /* 2. 让斜杠“动起来”：通过 background-position 偏移制造流动感 */
  protected override setProgress(p: number): void {
    super.setProgress(p); // 先更新宽度、文字

    if (this.wrapperProgress) {
      /* 进度越大，偏移越快，看起来像在往前冲 */
      const offset = (p / 100) * 200; // 200 是随意倍数，可自己调
      this.wrapperProgress.style.backgroundPosition = `${offset}px 0`;
    }
  }
}
