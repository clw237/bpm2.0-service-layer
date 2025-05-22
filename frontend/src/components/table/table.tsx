import { kf1I18nString } from 'kfone-component-library';
import { ITableProps } from 'model/interfaces';
import type { FC } from 'react';

export const Table: FC<ITableProps> = (props: ITableProps) => {
  const { data } = props;
  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center'></div>
      <div className='mt-8 flow-root' id='table-content' data-testid='table-content'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <table className='min-w-full divide-y divide-gray-300'>
              <thead>
                <tr>
                  <th
                    scope='col'
                    className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3'
                  >
                    {kf1I18nString('id')}
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    {kf1I18nString('name')}
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    {kf1I18nString('rating')}
                  </th>
                  <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-3'>
                    <span className='sr-only'>{kf1I18nString('viewImbd')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {data?.slice(0, 12)?.map((item: any) => (
                  <tr key={item.id} className='even:bg-gray-50'>
                    <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3'>
                      {item.id}
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                      {item.movie}
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                      {item.rating}
                    </td>
                    <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3'>
                      <a
                        href={item.imdb_url}
                        target='_blank'
                        className='text-indigo-600 hover:text-indigo-900'
                        rel='noreferrer'
                      >
                        {kf1I18nString('viewImbd')}
                        <span className='sr-only'>, {item.imdb_url}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
