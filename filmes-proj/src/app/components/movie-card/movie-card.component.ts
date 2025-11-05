import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.interface';
import { TmdbService } from '../../services/tmdb.service';
import { FavoritesService } from '../../services/favorites.service';
import { MovieListsService } from '../../services/movie-lists.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Output() movieClick = new EventEmitter<Movie>();

  constructor(
    public tmdbService: TmdbService,
    public favoritesService: FavoritesService,
    public movieListsService: MovieListsService
  ) {}

  onCardClick(): void {
    this.movieClick.emit(this.movie);
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.movie);
  }

  onWatchedClick(event: Event): void {
    event.stopPropagation();
    this.movieListsService.toggleWatched(this.movie);
  }

  onWatchlistClick(event: Event): void {
    event.stopPropagation();
    this.movieListsService.toggleWatchlist(this.movie);
  }

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.movie.id);
  }

  isWatched(): boolean {
    return this.movieListsService.isWatched(this.movie.id);
  }

  isInWatchlist(): boolean {
    return this.movieListsService.isInWatchlist(this.movie.id);
  }

  getRating(): string {
    return this.movie.vote_average.toFixed(1);
  }

  getYear(): string {
    if (!this.movie.release_date) return 'N/A';
    return new Date(this.movie.release_date).getFullYear().toString();
  }
}
