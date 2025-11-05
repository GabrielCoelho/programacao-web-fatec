import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Movie, MovieDetails, Genre } from '../models/movie.interface';
import { TMDBResponse, GenreListResponse } from '../models/tmdb-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiKey = environment.tmdbApiKey;
  private baseUrl = environment.tmdbBaseUrl;
  public imageBaseUrl = environment.tmdbImageBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get popular movies
   */
  getPopularMovies(page: number = 1): Observable<TMDBResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR')
      .set('page', page.toString());

    return this.http.get<TMDBResponse>(`${this.baseUrl}/movie/popular`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching popular movies:', error);
          return of({ page: 1, results: [], total_pages: 0, total_results: 0 });
        })
      );
  }

  /**
   * Search movies by query
   */
  searchMovies(query: string, page: number = 1): Observable<Movie[]> {
    if (!query.trim()) {
      return of([]);
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR')
      .set('query', query)
      .set('page', page.toString());

    return this.http.get<TMDBResponse>(`${this.baseUrl}/search/movie`, { params })
      .pipe(
        map(response => response.results),
        catchError(error => {
          console.error('Error searching movies:', error);
          return of([]);
        })
      );
  }

  /**
   * Get movie details by ID
   */
  getMovieDetails(id: number): Observable<MovieDetails | null> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR');

    return this.http.get<MovieDetails>(`${this.baseUrl}/movie/${id}`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching movie details:', error);
          return of(null);
        })
      );
  }

  /**
   * Get list of genres
   */
  getGenres(): Observable<Genre[]> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR');

    return this.http.get<GenreListResponse>(`${this.baseUrl}/genre/movie/list`, { params })
      .pipe(
        map(response => response.genres),
        catchError(error => {
          console.error('Error fetching genres:', error);
          return of([]);
        })
      );
  }

  /**
   * Discover movies with filters
   */
  discoverMovies(filters: {
    page?: number;
    genre?: number;
    year?: number;
    sortBy?: string;
  }): Observable<TMDBResponse> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR')
      .set('page', (filters.page || 1).toString());

    if (filters.genre) {
      params = params.set('with_genres', filters.genre.toString());
    }

    if (filters.year) {
      params = params.set('primary_release_year', filters.year.toString());
    }

    if (filters.sortBy) {
      params = params.set('sort_by', filters.sortBy);
    }

    return this.http.get<TMDBResponse>(`${this.baseUrl}/discover/movie`, { params })
      .pipe(
        catchError(error => {
          console.error('Error discovering movies:', error);
          return of({ page: 1, results: [], total_pages: 0, total_results: 0 });
        })
      );
  }

  /**
   * Get poster URL for a movie
   */
  getPosterUrl(posterPath: string | null, size: string = 'w500'): string {
    if (!posterPath) {
      return 'assets/no-poster.png';
    }
    return `${this.imageBaseUrl}/${size}${posterPath}`;
  }

  /**
   * Get backdrop URL for a movie
   */
  getBackdropUrl(backdropPath: string | null, size: string = 'w1280'): string {
    if (!backdropPath) {
      return 'assets/no-backdrop.png';
    }
    return `${this.imageBaseUrl}/${size}${backdropPath}`;
  }
}
