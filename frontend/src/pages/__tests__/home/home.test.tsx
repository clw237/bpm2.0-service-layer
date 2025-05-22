/** This file contains the test cases */
import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Home from '../../home';

afterEach(() => {
  cleanup();
});

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('kfone-component-library', () => ({
  kf1I18nString: vi.fn(() => 'Welcome'),
  KF1LanguageSelector: () => (
    <select>
      <option>English</option>
      <option>German</option>
    </select>
  ),
  KF1Button: vi.fn(() => <div></div>),
}));

const renderComponent = () => {
  return render(<Home />);
};

describe('Home component', () => {
  it('displays correct headings', () => {
    const { getByTestId } = renderComponent();
    const alertContent = getByTestId('root-home');
    expect(alertContent).toBeInTheDocument();
  });
});
