export type PreloadMode = 'auto' | 'manual';
export type AnimeStyle = 'spin' | '3dBox' | 'petal';

export interface PreloadConfig {
  elId?: string;
  minShow?: number;
  fadeOut?: number;
  mode?: PreloadMode;
  maxAttempts?: number;
  checkInterval?: number;
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
  rounded?: string;
  progress?: ProgressConfig;
  [key: string]: any;
}

export type ProgressConfig = {
  stroke?: number;
  isShowText?: boolean;
  color?: string;
  textColor?: string;
  textSize?: number;
};

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

export interface PreloadElements {
  animeEl: HTMLElement;
  progressEl: HTMLElement;
  textEl: HTMLElement;
  logoEl: HTMLElement;
}

export type DomRenderContext<T extends Partial<PreloadConfig>> = {
  elements: PreloadElements | null,
  config: T,
  debug: boolean,
  logoSrc?: string | undefined
}