import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

vi.mock('kfone-component-library', () => ({
  KF1Provider: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders App component', () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(container).toBeInTheDocument();
  });
});
