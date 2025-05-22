import type { FC, HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';

export type ImageFormat =
  | string
  | ReactNode
  | FC<HTMLAttributes<SVGElement>>
  | FC<ImgHTMLAttributes<HTMLImageElement>>;
