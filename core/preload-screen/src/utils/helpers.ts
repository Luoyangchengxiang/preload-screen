/*
 * @Date: 2025-09-25 11:16:45
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-30 10:04:41
 * @FilePath: \preload-screen\src\utils\helpers.ts
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

export function isNumberUnit(unit: any): unit is any {
  return !isNaN(parseFloat(unit)) && isFinite(parseFloat(unit));
}

export function handleUnits(value: any): number | undefined {
  return isNumberUnit(value) ? parseFloat(value) : undefined;
}