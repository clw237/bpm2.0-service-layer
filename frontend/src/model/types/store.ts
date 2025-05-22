import type { IRouterProps } from '../interfaces';
import type { State } from './';

export type MovieState = {
  movies: State[];
  isLoading: boolean;
};

export type MenuState = {
  menu: IRouterProps[];
};
