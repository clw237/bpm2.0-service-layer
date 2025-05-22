/** This file contains the test cases */
import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MFPricing from '../../pricing';

afterEach(() => {
  cleanup();
});

vi.mock('kfone-component-library', () => ({
  kf1I18nString: vi.fn(() => 'pricing'),
  KF1LanguageProvider: vi.fn(() => (
    <div id='root-pricing' data-testid='root-pricing'>
      pricing
    </div>
  )),
}));

let mockCheckString = true;
vi.mock('../../../utilities/helper', () => ({
  isString: vi.fn(() => mockCheckString),
}));

const renderComponent = () => {
  return render(<MFPricing />);
};

describe('MF Pricing component', () => {
  it('displays correct headings', () => {
    const { getByTestId } = renderComponent();
    const root = getByTestId('root-pricing');
    expect(root).toBeInTheDocument();
  });
});
