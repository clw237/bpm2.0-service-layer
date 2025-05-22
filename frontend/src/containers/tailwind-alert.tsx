import { Notify1, Notify2 } from 'components/notify';
import ListIcon from 'components/svg';
import { kf1Notify } from 'kfone-component-library';
import type { FC } from 'react';

const ReactTailwind: FC = () => {
  const notifyCustom1 = () => {
    kf1Notify({
      content: <Notify1.default />,
    });
  };

  const notifyCustom2 = () => {
    kf1Notify({
      content: <Notify2.default />,
    });
  };

  return (
    <div>
      {/* Custom UI */}
      <div className='w-6/12' data-testid='tailwind-section'>
        <div className='py-2 pl-10'>
          <span className='font-semibold underline underline-offset-8'>
            Custom UI with tailwind
          </span>
        </div>
        <div>
          <div>
            <button className='m-4 flex items-center' onClick={notifyCustom1}>
              <ListIcon /> <span>Notify ! (Content with close button)</span>
            </button>
          </div>
          <div>
            <button className='m-4 flex items-center' onClick={notifyCustom2}>
              <ListIcon /> <span>Notify ! (Content with custom close button)</span>
            </button>
          </div>
          <div className='m-4'>
            <div className='font-semibold underline underline-offset-4'>Note:</div>
            <div>Will customize the UI further once the initial figma is ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactTailwind;
