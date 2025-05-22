import type { ResponseState } from 'model/types';
import { customGet } from 'utilities';
import { describe, expect, it, vi } from 'vitest';
import { movieData } from '../__mocks__/movie';
import { apiURL, fetchMovie, GET_MOVIES } from '../movie';

vi.mock('utilities', () => ({
  customGet: vi.fn(),
}));

describe('fetchMovie', () => {
  it('should fetch movie data successfully', async () => {
    const mockData = [...movieData];
    (customGet as any).mockResolvedValue(mockData);
    const result = await fetchMovie();
    expect(result.response).toEqual(mockData);
    expect(customGet).toHaveBeenCalledWith(GET_MOVIES, {}, apiURL);
  });

  it('should handle error when fetching movie data fails', async () => {
    (customGet as any).mockRejectedValue(new Error('Network Error'));
    const result = await fetchMovie();
    expect(result.response).toEqual({} as ResponseState);
    expect(customGet).toHaveBeenCalledWith(GET_MOVIES, {}, apiURL);
  });
});
