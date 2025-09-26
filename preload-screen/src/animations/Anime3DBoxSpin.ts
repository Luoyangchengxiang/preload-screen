/*
 * @Date: 2025-09-24 17:15:29
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 15:16:15
 * @FilePath: \sourceHTML\preload-screen\src\animations\Anime3DBoxSpin.ts
 */

import "../css/box-loading.css"

export class Anime3DBoxSpin {
  private readonly AnimeClassName: string = 'chyk-anime-3D-box-spin';
  constructor() {
  }

  public create(): HTMLDivElement {
    const wrapper3DBoxSpin = document.createElement('div');
    wrapper3DBoxSpin.className = this.AnimeClassName;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 6; i++) {
      const childDiv = document.createElement('div');
      fragment.appendChild(childDiv);
    }
    wrapper3DBoxSpin.appendChild(fragment);
    return wrapper3DBoxSpin;
  }
}

