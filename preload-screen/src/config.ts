/*
 * @Date: 2025-09-18 15:58:13
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 16:34:52
 * @FilePath: \sourceHTML\preload-screen\src\config.ts
 */
import type { PreloadConfig } from './types-1';

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
  elId: '',
  color: "#1890ff",
  text: "Loading...",
  minShow: 300,
  fadeOut: 500,
  mode: "auto",
  logoConfig: '',
  animeStyle: 'spin',
};