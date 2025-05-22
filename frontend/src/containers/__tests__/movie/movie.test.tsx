/** This file contains the test cases */
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { useMovieStore } from 'store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Movie from '../../movie';

afterEach(() => {
  cleanup();
});

vi.mock('kfone-component-library', () => ({
  KF1Button: vi.fn(() => <button>Fetch Movies</button>),
  kf1I18nString: vi.fn(() => 'movie'),
}));

vi.mock('services/MovieAPI', () => ({
  fetchMovie: vi.fn(() => ({
    response: {
      data: [],
    },
  })),
}));

const renderComponent = () => {
  return render(<Movie />);
};

describe('should render movie component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMovieStore.setState({
      movies: [],
      isLoading: false,
      dispatch: vi.fn(),
    });
  });

  it('render movie section', () => {
    const { getByTestId } = renderComponent();
    const movieContent = getByTestId('movie-section');
    expect(movieContent).toBeInTheDocument();
  });

  it('fetches movies correctly on button click', () => {
    useMovieStore.setState({ isLoading: true });
    const { getByText } = renderComponent();
    fireEvent.click(getByText('Fetch Movies'));
  });
});
