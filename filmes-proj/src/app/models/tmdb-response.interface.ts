import { Movie } from './movie.interface';

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface GenreListResponse {
  genres: { id: number; name: string }[];
}
