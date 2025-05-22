import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tableData } from '../../__mocks__/table';
import Table from '../../table';

afterEach(() => {
  cleanup();
});

vi.mock('kfone-component-library', () => ({
  kf1I18nString: vi.fn(() => 'tailwind alert'),
}));

const renderComponent = () => {
  return render(<Table data={tableData.data} />);
};

describe('should render table component', () => {
  it('render table section', () => {
    const { getByTestId } = renderComponent();
    const tableContent = getByTestId('table-content');
    expect(tableContent).toBeInTheDocument();
  });
});
