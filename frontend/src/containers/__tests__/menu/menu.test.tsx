import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Menu from '../../menu';

afterEach(() => {
  cleanup();
});

vi.mock('react-router-dom', () => ({
  Link: ({ children }: any) => <div>{children}</div>,
}));

const renderComponent = () => {
  return render(<Menu />);
};

describe('should render menu component', () => {
  it('render menu section', () => {
    const { getByTestId } = renderComponent();
    const menuContent = getByTestId('menu-section');
    expect(menuContent).toBeInTheDocument();
  });
});
