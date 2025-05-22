/** This file contains the route of entire project */
import Icons from 'components/typed-icons';
import {
  // kf1GetEnvironmentVariables,
  kf1GetModuleRegistry,
  kf1ImportRemoteComponent,
} from 'kfone-component-library';
import { Menu, MODULE_NAME } from 'model/constants';
import type { IRouterProps } from 'model/interfaces';
import type { ComponentType, FC, LazyExoticComponent } from 'react';
import { JSX, lazy, Suspense, useEffect, useId, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ILazyRouteProps, IModuleRegistry } from '../model/interfaces/module';
import { useRouteStore } from '../store';

const Home: LazyExoticComponent<FC> = lazy(() => import('../pages/home'));
const Library: LazyExoticComponent<FC> = lazy(() => import('../pages/library'));
const Movies: LazyExoticComponent<FC> = lazy(
  () => import('../pages/library/sub-routes/movie-library'),
);
const ODSTokensIntegrationPage: LazyExoticComponent<FC> = lazy(
  () => import('../pages/ods-tokens-integration'),
);
const NotificationProvider: LazyExoticComponent<FC> = lazy(
  () => import('../pages/library/sub-routes/notification-provider'),
);

const GlobalRouter = () => {
  const [routeProps, setRouteProps] = useState<ILazyRouteProps[]>([]);
  const { dispatch }: any = useRouteStore();
  const menuID: string = useId();
  const { setMenuItems } = Menu;

  useEffect(() => {
    const data: ILazyRouteProps[] = generateRouteProps(
      kf1GetModuleRegistry(),
      <div>Error Ocurred</div>,
      <div>Loading...</div>,
    );

    const payload: IRouterProps[] = data?.map((item: any, index: number) => {
      return {
        id: menuID + index,
        label: item?.label,
        route: item?.path,
        icon: item?.label === 'Remote Page' ? Icons.Remote : Icons.Module,
      };
    });
    dispatch({
      type: setMenuItems,
      payload: payload,
    });
    setRouteProps(data);
  }, []);

  const generateRouteProps = (
    moduleRegistry: IModuleRegistry,
    errorComponent: JSX.Element,
    fallbackComponent: JSX.Element,
  ): ILazyRouteProps[] => {
    // //to validate env variables method
    // const data = kf1GetEnvironmentVariables(moduleRegistry?.modules[1]?.name);
    // console.log('Environment Variables:', data);

    const routeProps: ILazyRouteProps[] = [];

    const filteredModules = { ...moduleRegistry }?.modules.filter(
      (module): boolean => module.name !== MODULE_NAME,
    );

    filteredModules?.forEach((module) => {
      module.exposes
        .filter((component) => !!component.route)
        .map((entry) => {
          // static import - build time
          // const Component: LazyExoticComponent<ComponentType<any>> = lazy(
          //   () => import('remote_app/RemotePage') as any,
          // );

          // dynamic import - runtime
          const Component: LazyExoticComponent<ComponentType<any>> = lazy(
            (): Promise<{ default: ComponentType<any> }> =>
              kf1ImportRemoteComponent(module.name, entry.name),
          );

          routeProps.push({
            key: entry.name,
            label: entry.displayName,
            element: <Component />,
            fallbackComponent,
            errorComponent,
            path: entry.route ?? '',
            onError: (): void => console.error(`Error trying to load ${entry.route}`),
          });
        });
    });

    return routeProps;
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/library'>
          <Route index element={<Library />} />
          <Route path='movies' element={<Movies />} />
          <Route path='notification' element={<NotificationProvider />} />
        </Route>
        <Route path='odsTokensIntegration' element={<ODSTokensIntegrationPage />} />
        {routeProps.map((rp: any) => (
          <Route key={rp.key} path={rp.path} element={rp.element} />
        ))}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Suspense>
  );
};

export default GlobalRouter;
