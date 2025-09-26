/*
 * @Date: 2025-09-25 11:16:45
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 11:16:52
 * @FilePath: \sourceHTML\preload-screen\src\utils\help.ts
 */
export function isLogoConfigObject(config: any): config is { src: string } {
  return typeof config === 'object' && config !== null && 'src' in config;
}

export function isValidMode(mode: string): mode is 'auto' | 'manual' {
  return mode === 'auto' || mode === 'manual';
}

export function isValidAnimeStyle(style: string): style is 'spin' | '3dBox' | 'petal' {
  return ['spin', '3dBox', 'petal'].includes(style);
}