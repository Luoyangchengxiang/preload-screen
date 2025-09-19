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

export const config: PreloadConfig = {
  debug: false,
  color: "#1890ff",
  text: "Loading...",
  minShow: 300,
  fadeOut: 500,
  mode: "manual",
  elId: 'root'
};