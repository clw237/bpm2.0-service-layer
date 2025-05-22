import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Content1 from '../../notify/content-one';

afterEach(() => {
  cleanup();
});

vi.mock('kfone-component-library', () => ({
  kf1I18nString: vi.fn(() => 'content one'),
}));

const renderComponent = () => {
  return render(<Content1 />);
};

describe('content one component', () => {
  it('displays correct headings', () => {
    const { getByTestId } = renderComponent();
    const alertContent = getByTestId('alert-content');
    expect(alertContent).toBeInTheDocument();
  });
});
