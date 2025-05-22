import type { SVGProps } from 'react';
import type { ImageFormat } from '../types';

export interface IIconList {
  id?: string;
  className?: string;
  props?: SVGProps<SVGSVGElement>;
}

export interface IIconPorps {
  Library: ImageFormat;
  Home: ImageFormat;
  Module: ImageFormat;
  ReactLogo: ImageFormat;
  Remote: ImageFormat;
  Tailwind: ImageFormat;
  Zustand: ImageFormat;
}
