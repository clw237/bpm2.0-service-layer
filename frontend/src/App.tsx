import { KF1Interfaces, KF1Provider } from 'kfone-component-library';
import 'kfone-component-library/dist/style.css';
import type { FC } from 'react';
import { useEffect, useId, useState } from 'react';
import Icons from './components/typed-icons';
import { IRouterProps } from './model/interfaces';
import GlobalRouter from './router';
import appLanguageResources from './shared/locales';
import { useRouteStore } from './store';

const App: FC = () => {
  const languageProps: KF1Interfaces.ILanguageProviderProps = {
    resources: appLanguageResources,
    translationId: 'frontend',
  };
  const { menu }: any = useRouteStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [menuItems, setMenuItems] = useState<IRouterProps[]>([
    { id: useId(), label: 'Home', route: '/', icon: Icons.Home }, //default route
    { id: useId(), label: 'Library', route: '/library', icon: Icons.Library }, // API integration with KF1Button & Tailwind UI Component
  ]);

  useEffect(() => {
    if (menu?.length && menu[0]?.id !== 0) {
      setMenuItems((menuItems: IRouterProps[]) => [...menuItems, ...menu]);
    }
  }, [menu]);

  //Uncomment the following code to see the menuItems in the console
  // useEffect(() => {
  //   if (menuItems?.length >= 3) console.log('menuItems', menuItems);
  // }, [menuItems]);

  return (
    <KF1Provider languageProps={languageProps}>
      <div className='h-lvh lg:bg-slate-50'>
        <GlobalRouter />
      </div>
    </KF1Provider>
  );
};

export default App;
