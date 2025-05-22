import { Menu } from 'model/constants';
import type { MenuState } from 'model/types';
import { createElement } from 'react';
import { create } from 'zustand';

export const initialState: MenuState = {
  menu: [
    {
      id: 0,
      label: 'remoteContainer',
      route: '/',
      icon: createElement('div', null, 'remoteContainer'),
    },
  ],
};

const reducer = (state: MenuState, { type, payload }: any) => {
  switch (type) {
    case Menu.setMenuItems:
      return { menu: payload };

    case Menu.reset:
      return { ...initialState };

    default:
      return state;
  }
};

export const useRouteStore = create((set) => ({
  ...initialState,
  dispatch: (args: any) => set((state: MenuState) => reducer(state, args)),
}));
