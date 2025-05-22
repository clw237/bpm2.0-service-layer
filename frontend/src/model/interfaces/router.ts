import type { FC, HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';

export interface IRouterProps {
  id: number | string;
  label: string;
  route: string;
  icon:
    | string
    | ReactNode
    | FC<HTMLAttributes<SVGElement>>
    | FC<ImgHTMLAttributes<HTMLImageElement>>;
}
