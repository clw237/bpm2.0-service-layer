export type State = {
  id: number;
  image: string;
  imdb_url: string;
  movie: string;
  rating: number;
};

export type ResponseState = {
  config: any;
  data: State[];
  headers: any;
  request: any;
  status: number;
  statusText: string;
};

export type Result = {
  response: ResponseState;
};
