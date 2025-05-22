/**
 * COMPONENTS
 * This is a reusable REACT element that can be used in multiple containers or pages.
 * It is dumb always, meaning it has access to the props only to render it.
 */

/**
 * menu.tsx is created to plug-in the menu items view in the library route via pages/library/index.tsx
 */

/** A common index.tsx file is created to export multiple similar components of different variants together */

import * as C1 from './content-one';
import * as C2 from './content-two';

export { C1 as Notify1, C2 as Notify2 };
