/** This file contains the test cases */
import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MFIntroduction from '../../introduction';

afterEach(() => {
  cleanup();
});

vi.mock('kfone-component-library', () => ({
  kf1I18nString: vi.fn(() => 'introduction'),
  KF1LanguageProvider: vi.fn(() => (
    <div id='root-introduction' data-testid='root-introduction'>
      introduction
    </div>
  )),
}));

let mockCheckString = true;
vi.mock('../../../utilities/helper', () => ({
  isString: vi.fn(() => mockCheckString),
}));

const renderComponent = () => {
  return render(<MFIntroduction />);
};

describe('MF Introduction component', () => {
  it('displays correct headings', () => {
    const { getByTestId } = renderComponent();
    const root = getByTestId('root-introduction');
    expect(root).toBeInTheDocument();
  });
});
