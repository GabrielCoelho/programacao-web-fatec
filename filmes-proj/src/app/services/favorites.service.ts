import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from '../models/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'movieFavorites';
  private favoritesSubject: BehaviorSubject<Movie[]>;
  public favorites$: Observable<Movie[]>;

  constructor() {
    const storedFavorites = this.loadFromStorage();
    this.favoritesSubject = new BehaviorSubject<Movie[]>(storedFavorites);
    this.favorites$ = this.favoritesSubject.asObservable();
  }

  /**
   * Load favorites from localStorage
   */
  private loadFromStorage(): Movie[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      return [];
    }
  }

  /**
   * Save favorites to localStorage
   */
  private saveToStorage(favorites: Movie[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }

  /**
   * Get current favorites array
   */
  getFavorites(): Movie[] {
    return this.favoritesSubject.value;
  }

  /**
   * Add a movie to favorites
   */
  addFavorite(movie: Movie): void {
    const currentFavorites = this.getFavorites();

    // Check if movie is already in favorites
    if (!this.isFavorite(movie.id)) {
      const updatedFavorites = [...currentFavorites, movie];
      this.favoritesSubject.next(updatedFavorites);
      this.saveToStorage(updatedFavorites);
    }
  }

  /**
   * Remove a movie from favorites
   */
  removeFavorite(movieId: number): void {
    const currentFavorites = this.getFavorites();
    const updatedFavorites = currentFavorites.filter(movie => movie.id !== movieId);

    this.favoritesSubject.next(updatedFavorites);
    this.saveToStorage(updatedFavorites);
  }

  /**
   * Toggle favorite status of a movie
   */
  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie.id)) {
      this.removeFavorite(movie.id);
    } else {
      this.addFavorite(movie);
    }
  }

  /**
   * Check if a movie is in favorites
   */
  isFavorite(movieId: number): boolean {
    return this.getFavorites().some(movie => movie.id === movieId);
  }

  /**
   * Get count of favorites
   */
  getFavoritesCount(): number {
    return this.getFavorites().length;
  }

  /**
   * Clear all favorites
   */
  clearFavorites(): void {
    this.favoritesSubject.next([]);
    this.saveToStorage([]);
  }
}
