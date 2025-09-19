/*
 * @Date: 2025-09-18 15:58:13
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-19 10:23:10
 * @FilePath: \sourceHTML\preload-screen\src\config.ts
 */
type eleId = 'root' | 'app';

export interface PreloadConfig {
  debug?: boolean;
  text?: string;
  color?: string;
  mode?: 'auto' | 'manual';
  minShow?: number;
  fadeOut?: number;
  elId: eleId | string
}
/**
 * @description: 支持配置文件
 * @param {*} color：动画颜色
 * @param {*} text：显示文案
 * @param {*} minShow：最少显示时间（ms）
 * @param {*} fadeOut：淡出动画时间（ms）
 * @param {*} mode：auto / manual，控制是否监听 window.load 自动消失
 * @return {*}
 */
export const config: PreloadConfig = {
  debug: false,
  color: "#1890ff",
  text: "Loading...",
  minShow: 300,
  fadeOut: 500,
  mode: "manual",
  elId: 'root'
};