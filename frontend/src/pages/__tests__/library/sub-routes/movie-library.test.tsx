/** This file contains the test cases */
import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MovieLibrary from '../../../library/sub-routes/movie-library';

afterEach(() => {
  cleanup();
});

vi.mock('kfone-component-library', () => ({
  KF1Button: vi.fn(() => <button>Fetch Movies</button>),
  kf1I18nString: vi.fn(() => 'movie'),
}));

const renderComponent = () => {
  return render(<MovieLibrary />);
};

describe('Movie Library component', () => {
  it('displays correct headings', () => {
    const { getByTestId } = renderComponent();
    const movieContent = getByTestId('movie-section');
    expect(movieContent).toBeInTheDocument();
  });
});
