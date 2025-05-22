import { kf1I18nString } from 'kfone-component-library';
import { useNavigate } from 'react-router-dom';
import { isString } from '../../utilities/helper';
import Button from '../button';
import Icons from '../typed-icons';
import './index.css';

const Introduction = () => {
  const navigate = useNavigate();
  return (
    <div className='root-pages'>
      <div className='mt-16 text-center'>
        <h3 className='header-pages' id='welcome-app' data-testid='welcome-app'>
          {kf1I18nString('welcomeToApp')}
        </h3>
        <h3 className='header-pages pt-4'>{kf1I18nString('welcomeToAppDesc')}</h3>
        <Button onBtnClick={() => navigate('library')} label={kf1I18nString('tailwindButton')} />
        <div className='mt-16 flex'>
          <div className='h-72 w-72 p-2'>
            {isString(Icons.ReactLogo) ? (
              <img alt='React Logo' src={Icons.ReactLogo} />
            ) : (
              <span id='invalidImgReact' data-testid='invalidImgReact'>
                {kf1I18nString('invalidImage')}
              </span>
            )}
          </div>
          <div>
            {isString(Icons.Zustand) ? (
              <img className='h-72 w-full p-2' alt='Zustand Logo' src={Icons.Zustand} />
            ) : (
              <span id='invalidImgZustand' data-testid='invalidImgZustand'>
                {kf1I18nString('invalidImage')}
              </span>
            )}
          </div>
          <div className='h-58 w-96 p-2 pl-4 pt-16'>
            {isString(Icons.Tailwind) ? (
              <img alt='Tailwind Logo' src={Icons.Tailwind} />
            ) : (
              <span id='invalidImgTailwind' data-testid='invalidImgTailwind'>
                {kf1I18nString('invalidImage')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;

/** Reference - Example of consuming remote component dynamically */

// import { kf1GetModuleRegistry, kf1ImportRemoteComponent } from 'kfone-component-library';
// import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
// import { people } from '../lib/model/data/mock'; --local data
// import { MODULE_NAME } from '../lib/model/remote'; --local module name

// const mName: string = kf1GetModuleRegistry()?.modules.filter(
//   (module): boolean => module.name !== MODULE_NAME,
// )[0]?.name; //remote module name

// const cName = 'List'; //remote component name

// //Dynamic imports
// const HostComponent: LazyExoticComponent<ComponentType<any>> = lazy(
//   (): Promise<{ default: ComponentType<any> }> => kf1ImportRemoteComponent(mName, cName),
// );

// const Host = () => {
//   return (
//     <div>
//         <HostComponent data={people} />
//     </div>
//   );
// };
// export default Host;
