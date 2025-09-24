/*
 * @Date: 2025-09-18 15:58:13
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-24 17:52:50
 * @FilePath: \sourceHTML\preload-screen\src\config.ts
 */
type eleId = 'root' | 'app';
export type PreloadMode = 'auto' | 'manual';
export type AnimeStyle = 'spin' | 'petal' | '3dBox';
// 'snow' |
export type LogoConfig = {
  src: string;
  width?: string;
  height?: string;
  alt?: string;
}
export interface PreloadConfig {
  debug?: boolean;
  text?: string;
  color?: string;
  mode?: PreloadMode;
  minShow?: number;
  fadeOut?: number;
  elId?: eleId | string;
  logoConfig?: LogoConfig | string;
  animeStyle?: AnimeStyle;
}
/**
 * @description: 支持配置文件
 * @param {*} color：动画颜色
 * @param {*} text：显示文案
 * @param {*} minShow：最少显示时间（ms）
 * @param {*} fadeOut：淡出动画时间（ms）
 * @param {*} mode：auto / manual
 * @return {*}
 */
export const config: PreloadConfig = {
  debug: false,
  elId: 'root',
  color: "#1890ff",
  text: "Loading...",
  minShow: 300,
  fadeOut: 500,
  mode: "manual",
  logoConfig: '',
  animeStyle: 'spin',
};