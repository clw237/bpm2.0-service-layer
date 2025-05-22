import Table from 'components/table';
import { KF1Button, kf1I18nString } from 'kfone-component-library';
import { Movie as MovieConstants } from 'model/constants';
import { Result, State } from 'model/types';
import { useEffect, type FC } from 'react';
import { fetchMovie } from 'services';
import { useMovieStore } from 'store';
import { twMerge } from 'tailwind-merge';

const Movie: FC = () => {
  const { dispatch, movies, isLoading }: any = useMovieStore();
  const { setMovie, setLoading, reset } = MovieConstants;

  useEffect(() => {
    return () => dispatch({ type: reset });
  }, []);

  const fetchMovies = async (): Promise<void> => {
    dispatch({ type: setLoading });

    const api: Result = await fetchMovie();
    const movies: State[] = api?.response?.data;
    if (api?.response?.data?.length) dispatch({ type: setMovie, payload: movies });
  };

  return (
    <div id='movie-section' data-testid='movie-section'>
      <div className={twMerge('root-pages sm:gap-y-3')}>
        <h3 className='header-pages mt-16 sm:text-2xl'>{kf1I18nString('tableDemo')}</h3>
        <div>
          {isLoading && (
            <KF1Button id='fetching-movies' text='Fetching'>
              <span className='loading loading-spinner mb-1 ml-4 align-middle' />
            </KF1Button>
          )}
          {!isLoading && (
            <KF1Button id='fetching-movies' text='Fetch Movies' onClick={fetchMovies} />
          )}
        </div>
        <div className='-mt-10 w-4/5'>
          {!isLoading && movies?.length > 0 && <Table data={movies} />}
        </div>
      </div>
    </div>
  );
};

export default Movie;
