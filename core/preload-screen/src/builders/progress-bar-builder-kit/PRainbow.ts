import { PDefault } from "./ProgressDefault";

export class PRainbow extends PDefault {
  // 1. 改外观
  protected override setupDOM() {
    super.setupDOM();          // 先拿父级节点
    this.wrapperProgress!.style.background =
      'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)';
    /* 让斜块向右移动 */
    this.wrapperProgress!.style.backgroundSize = '40px 40px';   /* 方块大小 */
    this.wrapperProgress!.style.animation = 'moveBar 1s linear infinite';
    return { wrapperProgress: this.wrapperProgress as HTMLDivElement, progressText: this.progressText as HTMLDivElement }; // 显式返回所需结构
  }

}
