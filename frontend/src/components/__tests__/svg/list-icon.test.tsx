import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ListIcon from '../../svg';

afterEach(() => {
  cleanup();
});

const renderComponent = () => {
  return render(<ListIcon />);
};

describe('List icon component', () => {
  it('displays correct headings', () => {
    const { getByTestId } = renderComponent();
    const listIcon = getByTestId('KF_List_Icon');
    expect(listIcon).toBeInTheDocument();
  });
});
