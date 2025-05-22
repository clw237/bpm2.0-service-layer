/**
 * PAGES
 * This is the main view that is rendered when a route is accessed
 * Parent view on UI that has access to containers & components
 */

/**
 * A library folder is created since this route has multiple sub-routes
 * Kept this as index.tsx for easy identification
 */

import Menu from 'containers/menu';
import { kf1I18nString } from 'kfone-component-library';

const Library = () => {
  return (
    <div className='root-pages' id='root-library' data-testid='root-library'>
      <div className='mt-16'>
        <h3 className='header-pages'>{kf1I18nString('sampleSubPage')}</h3>
        <Menu />
      </div>
    </div>
  );
};

export default Library;
