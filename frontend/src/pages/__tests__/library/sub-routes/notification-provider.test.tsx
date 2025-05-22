/** This file contains the test cases */
import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import NotificationProvider from '../../../library/sub-routes/notification-provider';

afterEach(() => {
  cleanup();
});

vi.mock('kfone-component-library', () => ({
  kf1I18nString: vi.fn(() => 'notification provider'),
}));

const renderComponent = () => {
  return render(<NotificationProvider />);
};

describe('Notification provider component', () => {
  it('displays correct headings', () => {
    const { getByTestId } = renderComponent();
    const movieContent = getByTestId('tailwind-section');
    expect(movieContent).toBeInTheDocument();
  });
});
