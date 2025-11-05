import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from '../models/movie.interface';

export type MovieListType = 'watched' | 'watchlist';

@Injectable({
  providedIn: 'root'
})
export class MovieListsService {
  private readonly WATCHED_KEY = 'movieWatched';
  private readonly WATCHLIST_KEY = 'movieWatchlist';

  private watchedSubject: BehaviorSubject<Movie[]>;
  private watchlistSubject: BehaviorSubject<Movie[]>;

  public watched$: Observable<Movie[]>;
  public watchlist$: Observable<Movie[]>;

  constructor() {
    const watchedMovies = this.loadFromStorage(this.WATCHED_KEY);
    const watchlistMovies = this.loadFromStorage(this.WATCHLIST_KEY);

    this.watchedSubject = new BehaviorSubject<Movie[]>(watchedMovies);
    this.watchlistSubject = new BehaviorSubject<Movie[]>(watchlistMovies);

    this.watched$ = this.watchedSubject.asObservable();
    this.watchlist$ = this.watchlistSubject.asObservable();
  }

  /**
   * Load list from localStorage
   */
  private loadFromStorage(key: string): Movie[] {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(`Error loading ${key} from storage:`, error);
      return [];
    }
  }

  /**
   * Save list to localStorage
   */
  private saveToStorage(key: string, movies: Movie[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(movies));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }

  /**
   * Get current watched movies
   */
  getWatched(): Movie[] {
    return this.watchedSubject.value;
  }

  /**
   * Get current watchlist
   */
  getWatchlist(): Movie[] {
    return this.watchlistSubject.value;
  }

  /**
   * Add movie to watched list
   */
  addToWatched(movie: Movie): void {
    const current = this.getWatched();
    if (!this.isWatched(movie.id)) {
      const updated = [...current, movie];
      this.watchedSubject.next(updated);
      this.saveToStorage(this.WATCHED_KEY, updated);
    }
  }

  /**
   * Remove movie from watched list
   */
  removeFromWatched(movieId: number): void {
    const current = this.getWatched();
    const updated = current.filter(movie => movie.id !== movieId);
    this.watchedSubject.next(updated);
    this.saveToStorage(this.WATCHED_KEY, updated);
  }

  /**
   * Add movie to watchlist
   */
  addToWatchlist(movie: Movie): void {
    const current = this.getWatchlist();
    if (!this.isInWatchlist(movie.id)) {
      const updated = [...current, movie];
      this.watchlistSubject.next(updated);
      this.saveToStorage(this.WATCHLIST_KEY, updated);
    }
  }

  /**
   * Remove movie from watchlist
   */
  removeFromWatchlist(movieId: number): void {
    const current = this.getWatchlist();
    const updated = current.filter(movie => movie.id !== movieId);
    this.watchlistSubject.next(updated);
    this.saveToStorage(this.WATCHLIST_KEY, updated);
  }

  /**
   * Toggle watched status
   */
  toggleWatched(movie: Movie): void {
    if (this.isWatched(movie.id)) {
      this.removeFromWatched(movie.id);
    } else {
      this.addToWatched(movie);
    }
  }

  /**
   * Toggle watchlist status
   */
  toggleWatchlist(movie: Movie): void {
    if (this.isInWatchlist(movie.id)) {
      this.removeFromWatchlist(movie.id);
    } else {
      this.addToWatchlist(movie);
    }
  }

  /**
   * Check if movie is watched
   */
  isWatched(movieId: number): boolean {
    return this.getWatched().some(movie => movie.id === movieId);
  }

  /**
   * Check if movie is in watchlist
   */
  isInWatchlist(movieId: number): boolean {
    return this.getWatchlist().some(movie => movie.id === movieId);
  }

  /**
   * Get watched count
   */
  getWatchedCount(): number {
    return this.getWatched().length;
  }

  /**
   * Get watchlist count
   */
  getWatchlistCount(): number {
    return this.getWatchlist().length;
  }

  /**
   * Clear watched list
   */
  clearWatched(): void {
    this.watchedSubject.next([]);
    this.saveToStorage(this.WATCHED_KEY, []);
  }

  /**
   * Clear watchlist
   */
  clearWatchlist(): void {
    this.watchlistSubject.next([]);
    this.saveToStorage(this.WATCHLIST_KEY, []);
  }
}
