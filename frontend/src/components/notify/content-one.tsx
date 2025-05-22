import { XMarkIcon } from '@heroicons/react/20/solid';
import { kf1I18nString } from 'kfone-component-library';

const Content1 = ({ closeToast }: any) => (
  <div className='rounded-md p-4'>
    <div className='flex items-center justify-between'>
      <div>
        <p
          className='text-sm font-medium text-gray-900'
          id='alert-content'
          data-testid='alert-content'
        >
          {kf1I18nString('notificationAlert')}
        </p>
      </div>
      <div className='leading-[10px]'>
        <button
          type='button'
          className='inline-flex rounded-md text-gray-400 hover:text-gray-700 focus:outline-none'
          onClick={closeToast}
        >
          <XMarkIcon className='h-5 w-5' aria-hidden='true' />
        </button>
      </div>
    </div>
  </div>
);

export default Content1;
