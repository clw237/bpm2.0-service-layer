/**
 * CONTAINERS
 * This is a reusable component that can be used in multiple views.
 * It is smart, meaning it has access to the store (zustand) and external services (api).
 * Child view on UI that has access to components
 */

/**
 * menu.tsx is created to plug-in the menu items view in the library route via pages/library/index.tsx
 */

import ListIcon from 'components/svg';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { sampleList } from './__mocks__/menu/items';

const Menu: FC = () => {
  return (
    <ul className='divide-y divide-gray-200' id='menu-section' data-testid='menu-section'>
      {sampleList.map((item) => (
        <li key={item.id} className='py-4'>
          <Link key={item.id} to={item.route}>
            <button
              type='button'
              className='flex items-center rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500'
            >
              <ListIcon /> {item.label}
            </button>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Menu;
