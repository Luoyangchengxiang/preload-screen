export type PreloadMode = 'auto' | 'manual';
export type AnimeStyle = 'spin' | '3dBox' | 'petal';

export interface PreloadConfig {
  elId?: string;
  minShow?: number;
  fadeOut?: number;
  mode?: PreloadMode;
  text?: string;
  color?: string;
  debug?: boolean;
  logoConfig?: LogoConfig | string;
  animeStyle?: AnimeStyle;
}

export interface LogoConfig {
  src: string;
  width?: string;
  height?: string;
  [key: string]: any;
}

export type FlowerConfig = {
  petalCount: number;
  innerRadius: number;
  petalLength: number;
  petalWidth: number;
  rotationSpeed: number;
  swaySpeed: number;
  swayAngle: number;
  petalColor: string;
  petalSecondary: string;
  centerColor: string;
  blendMode: GlobalCompositeOperation;
};