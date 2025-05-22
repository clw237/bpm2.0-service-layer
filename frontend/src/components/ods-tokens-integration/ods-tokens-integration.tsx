import './style.css';

const IntegrationApproach2 = () => {
  return (
    <div className='mt-4 space-y-4 rounded-ods-border-radius-Large border-ods-border-width-small border-ods-color-secondary-900 p-4'>
      <div className='mb-3 text-lg underline'>Approach 2: (in CSS)</div>
      <div className='kf1-button-sample'>Sample text</div>
      <div className='mt-3 overflow-x-auto rounded-md bg-gray-800 p-4 text-white'>
        <pre className='whitespace-pre-wrap'>
          <code className='language-css'>
            {`
  import './style.css';

  <div className='kf1-button-sample'>Sample text</div>

  /* styles.css */
  .kf1-button-sample {
    @apply w-40 rounded-ods-border-radius-medium bg-ods-color-primary-400 p-2 text-center text-ods-text-button-large;
  }
            `}
          </code>
        </pre>
      </div>
    </div>
  );
};

const IntegrationApproach1 = () => {
  return (
    <div className='space-y-4 rounded-ods-border-radius-Large border-ods-border-width-small border-ods-color-secondary-900 p-4'>
      <div className='mb-3 text-lg underline'>Approach 1: (in JSX)</div>
      <div className='w-40 rounded-ods-border-radius-medium bg-ods-color-primary-400 p-2 text-center text-ods-text-button-large'>
        Sample text
      </div>
      <div className='mt-3 overflow-x-auto rounded-md bg-gray-800 p-4 text-white'>
        <pre className='whitespace-pre-wrap'>
          <code className='language-css'>
            {`
  <div className='w-40 rounded-ods-border-radius-medium bg-ods-color-primary-400 p-2 text-center text-ods-text-button-large'>
    Sample text
  </div>
            `}
          </code>
        </pre>
      </div>
    </div>
  );
};

const ODSTokensIntegration = () => {
  const odsTokens = [
    {
      ctg: 'Color',
      tokenName: 'ods-color-primary-400',
      tokenValue: '#00C29B',
    },
    {
      ctg: 'Typography',
      tokenName: 'ods-text-button-large',
      tokenValue: 'fontSize: 1.25rem; lineHeight: 1.75rem; fontWeight: 700;',
    },
    {
      ctg: 'Border radius',
      tokenName: 'ods-border-radius-medium',
      tokenValue: '0.5rem',
    },
  ];

  return (
    <div className='container mx-auto'>
      <div>
        <h1 className='font-sans text-[30px] font-bold'>ODS Tokens</h1>
        <p>
          One Design System (ODS) tokens are standardized, reusable entities that store visual
          design attributes, such as color, typography, spacing, and so on.
        </p>
      </div>

      <hr className='my-2' />

      <div>
        <div className='mb-3 text-2xl font-bold'>Sample Tokens:</div>

        <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'>
          <table className='min-w-full divide-y divide-gray-300'>
            <thead className='bg-sky-50'>
              <tr className='divide-x divide-gray-200'>
                <th
                  scope='col'
                  className='py-3.5 !pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0'
                >
                  Category
                </th>
                <th
                  scope='col'
                  className='px-4 py-3.5 text-left text-sm font-semibold text-gray-900'
                >
                  Token Name
                </th>
                <th
                  scope='col'
                  className='px-4 py-3.5 text-left text-sm font-semibold text-gray-900'
                >
                  Token Value
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {odsTokens.map(({ ctg, tokenName, tokenValue }) => (
                <tr key={tokenName} className='divide-x divide-gray-200'>
                  <td className='whitespace-nowrap py-4 !pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0'>
                    {ctg}
                  </td>
                  <td className='whitespace-nowrap p-4 text-sm text-gray-500'>{tokenName}</td>
                  <td className='whitespace-nowrap p-4 text-sm text-gray-500'>{tokenValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='my-5'>
          <li>
            ODS tokens complete details available in `
            <b>kfone-frontend-common - kfone-component-library</b>` repo&lsquo;s storybook.
          </li>
          <li>ODS tokens is integrated (extended) with tailwind through tailwind.config.js</li>
          <li>Here are some examples of how to integrate ODS tokens into the application.</li>
        </div>

        <div>
          <div className='mb-3 text-2xl font-bold'>Integration:</div>
          <IntegrationApproach1 />
          <IntegrationApproach2 />
          <div className='py-4 text-lg font-semibold'>
            <b>Note:</b> Its recommended to use the approach 2 (tailwind in css file)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ODSTokensIntegration;
