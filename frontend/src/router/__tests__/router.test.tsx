import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import GlobalRouter from '..';

vi.mock('kfone-component-library', () => ({
  KF1LanguageSelector: () => (
    <select>
      <option>English</option>
      <option>German</option>
    </select>
  ),
  kf1I18nString: vi.fn(() => 'Welcome'),
  kf1GetModuleRegistry: vi.fn(() => ({
    modules: [
      {
        name: 'module1',
        exposes: [
          {
            name: 'Component1',
            route: '/module1/component1',
            displayName: 'Component 1',
          },
        ],
      },
      {
        name: 'module2',
        exposes: [
          {
            name: 'Component2',
            route: '/module2/component2',
            displayName: 'Component 2',
          },
        ],
      },
    ],
  })),
  kf1ImportRemoteComponent: vi.fn(() =>
    Promise.resolve({ default: () => <div>Mocked Component</div> }),
  ),
}));

describe('GlobalRouter component', () => {
  it('renders component correctly', () => {
    const { container } = render(
      <BrowserRouter>
        <GlobalRouter />
      </BrowserRouter>,
    );
    expect(container).toBeInTheDocument();
  });
});
