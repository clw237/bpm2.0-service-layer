/** This file contains the test cases */
import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TailwindAlert from '../../tailwind-alert';

afterEach(() => {
  cleanup();
});

vi.mock('kfone-component-library', () => ({
  kf1I18nString: vi.fn(() => 'tailwind alert'),
}));

const renderComponent = () => {
  return render(<TailwindAlert />);
};

describe('should render tailwind alert component', () => {
  it('render tailwind alert section', () => {
    const { getByTestId } = renderComponent();
    const tailwindContent = getByTestId('tailwind-section');
    expect(tailwindContent).toBeInTheDocument();
  });
});
