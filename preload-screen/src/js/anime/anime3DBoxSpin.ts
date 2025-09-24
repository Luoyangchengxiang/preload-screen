/*
 * @Date: 2025-09-24 17:15:29
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-24 17:37:12
 * @FilePath: \sourceHTML\preload-screen\src\js\anime\anime3DBoxSpin.ts
 */

import "../../css/box-loading.css"

export class Anime3DBoxSpin {
  private readonly AnimeClassName: string = 'chyk-anime-3D-box-spin';
  constructor() {
  }

  public create(): HTMLDivElement {
    const wrapper3DBoxSpin = document.createElement('div');
    wrapper3DBoxSpin.className = this.AnimeClassName;
    wrapper3DBoxSpin.innerHTML = `
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    `;
    return wrapper3DBoxSpin;
  }
}

