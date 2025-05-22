import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { kf1I18nString } from 'kfone-component-library';

const Content2 = ({ closeToast }: any) => (
  <div className='rounded-md bg-green-50 p-4'>
    <div className='flex'>
      <div className='flex-shrink-0'>
        <CheckCircleIcon className='h-5 w-5 text-green-400' aria-hidden='true' />
      </div>
      <div className='ml-3'>
        <p
          className='text-sm font-medium text-green-800'
          id='alert-content'
          data-testid='alert-content'
        >
          {kf1I18nString('successfullySaved')}
        </p>
      </div>
      <div className='ml-auto pl-3'>
        <div className='-mx-1.5 -my-1.5'>
          <button
            type='button'
            className='inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:text-green-700 focus:outline-none'
            onClick={closeToast}
          >
            <XMarkIcon className='h-5 w-5' aria-hidden='true' />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Content2;
