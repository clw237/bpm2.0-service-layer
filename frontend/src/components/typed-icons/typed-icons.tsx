import Library from 'assets/images/cinema.png';
import Home from 'assets/images/home.svg';
import Module from 'assets/images/modules.png';
import ReactLogo from 'assets/images/react.png';
import Remote from 'assets/images/remote.svg';
import Tailwind from 'assets/images/tailwind.png';
import Zustand from 'assets/images/zustand.png';
import { IIconPorps } from 'model/interfaces';
import type { FC, HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';

/** Define the Images object with the icons */
const Images: IIconPorps = {
  Library,
  Home,
  Module,
  ReactLogo,
  Remote,
  Tailwind,
  Zustand,
} as const;

/** Define a mapped type to ensure all properties are of type string */
type Stringify<T> = {
  [P in keyof T]:
    | string
    | ReactNode // ReactNode type
    | FC<HTMLAttributes<SVGElement>> //SVG type
    | FC<ImgHTMLAttributes<HTMLImageElement>>; //PNG type
};

/** Define TypedIcons directly with the correct types based on Images */
export const TypedIcons: Stringify<typeof Images> = Images;
