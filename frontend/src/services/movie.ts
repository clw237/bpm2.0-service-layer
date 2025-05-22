import type { ResponseState, Result } from 'model/types/movie';
import { customGet } from 'utilities';

export const GET_MOVIES = 'api/movies';
export const apiURL = 'https://dummyapi.online/';

export const fetchMovie = async (): Promise<Result> => {
  try {
    const fetchData = await customGet<any>(GET_MOVIES, {}, apiURL);
    return { response: fetchData as ResponseState };
  } catch (err) {
    console.log(err);
    return { response: {} as ResponseState };
  }
};
