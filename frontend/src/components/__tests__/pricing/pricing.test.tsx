import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Pricing from '../../pricing';

vi.mock('kfone-component-library', () => ({
  kf1I18nString: vi.fn(() => 'Welcome'),
}));

afterEach(() => {
  cleanup();
});

const renderComponent = () => {
  return render(<Pricing />);
};

describe('pricing component', () => {
  it('displays correct headings', () => {
    const { getByTestId } = renderComponent();
    const simpleTitle = getByTestId('simple-noTricks');
    const simpleDesc = getByTestId('simple-noTricks');
    expect(simpleTitle).toBeInTheDocument();
    expect(simpleDesc).toBeInTheDocument();
  });
});
