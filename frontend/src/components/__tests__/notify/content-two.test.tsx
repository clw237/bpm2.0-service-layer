import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Content2 from '../../notify/content-two';

afterEach(() => {
  cleanup();
});

vi.mock('kfone-component-library', () => ({
  kf1I18nString: vi.fn(() => 'content two'),
}));

const renderComponent = () => {
  return render(<Content2 />);
};

describe('content two component', () => {
  it('displays correct headings', () => {
    const { getByTestId } = renderComponent();
    const alertContent = getByTestId('alert-content');
    expect(alertContent).toBeInTheDocument();
  });
});
