import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDetails } from '../../models/movie.interface';
import { TmdbService } from '../../services/tmdb.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-movie-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-modal.component.html',
  styleUrl: './movie-modal.component.css'
})
export class MovieModalComponent implements OnInit {
  @Input() movieId!: number;
  @Output() close = new EventEmitter<void>();

  movieDetails: MovieDetails | null = null;
  isLoading = true;

  constructor(
    public tmdbService: TmdbService,
    public favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadMovieDetails();
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.onClose();
  }

  loadMovieDetails(): void {
    this.isLoading = true;
    this.tmdbService.getMovieDetails(this.movieId).subscribe({
      next: (details) => {
        this.movieDetails = details;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading movie details:', error);
        this.isLoading = false;
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  toggleFavorite(): void {
    if (this.movieDetails) {
      this.favoritesService.toggleFavorite(this.movieDetails);
    }
  }

  isFavorite(): boolean {
    return this.movieDetails ? this.favoritesService.isFavorite(this.movieDetails.id) : false;
  }

  getRating(): string {
    return this.movieDetails ? this.movieDetails.vote_average.toFixed(1) : '0.0';
  }

  getRuntime(): string {
    if (!this.movieDetails?.runtime) return 'N/A';
    const hours = Math.floor(this.movieDetails.runtime / 60);
    const minutes = this.movieDetails.runtime % 60;
    return `${hours}h ${minutes}min`;
  }

  getReleaseYear(): string {
    if (!this.movieDetails?.release_date) return 'N/A';
    return new Date(this.movieDetails.release_date).getFullYear().toString();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
}
