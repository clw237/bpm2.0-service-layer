import { Movie } from 'model/constants';
import type { MovieState } from 'model/types';
import { create } from 'zustand';

export const initialState: MovieState = {
  movies: [],
  isLoading: false,
};

const reducer = (state: MovieState, { type, payload }: any) => {
  switch (type) {
    case Movie.setMovie:
      return { movies: payload, isLoading: !state.isLoading };

    case Movie.setLoading:
      return { isLoading: !state.isLoading };

    case Movie.reset:
      return { ...initialState };

    default:
      return state;
  }
};

export const useMovieStore = create((set) => ({
  ...initialState,
  dispatch: (args: any) => set((state: MovieState) => reducer(state, args)),
}));
