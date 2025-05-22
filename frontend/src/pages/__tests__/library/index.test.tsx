/** This file contains the test cases */
import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Library from '../../library';

afterEach(() => {
  cleanup();
});

vi.mock('kfone-component-library', () => ({
  kf1I18nString: vi.fn(() => 'library'),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children }: any) => <div>{children}</div>,
}));

const renderComponent = () => {
  return render(<Library />);
};

describe('Library component', () => {
  it('displays correct headings', () => {
    const { getByTestId } = renderComponent();
    const alertContent = getByTestId('root-library');
    expect(alertContent).toBeInTheDocument();
  });
});
