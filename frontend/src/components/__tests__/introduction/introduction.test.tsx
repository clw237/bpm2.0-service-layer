import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Introduction from '../../introduction';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('kfone-component-library', () => ({
  kf1I18nString: vi.fn(() => 'Welcome'),
}));

let mockCheckString = true;
vi.mock('../../../utilities/helper', () => ({
  isString: vi.fn(() => mockCheckString),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const renderComponent = () => {
  return render(<Introduction />);
};

describe('introduction component', () => {
  it('displays correct headings', () => {
    const { getByTestId } = renderComponent();
    const welcomeApp = getByTestId('welcome-app');
    expect(welcomeApp).toBeInTheDocument();
  });
});

describe('introduction handles invalid image component', () => {
  beforeEach(() => {
    mockCheckString = false;
  });
  it('handles invalid image sources correctly', () => {
    const { getByTestId } = renderComponent();
    const invalidImgReact = getByTestId('invalidImgReact');
    const invalidImgZustand = getByTestId('invalidImgZustand');
    const invalidImgTailwind = getByTestId('invalidImgTailwind');
    expect(invalidImgReact).toBeInTheDocument();
    expect(invalidImgZustand).toBeInTheDocument();
    expect(invalidImgTailwind).toBeInTheDocument();
  });
});
