import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbService } from '../../services/tmdb.service';
import { Movie } from '../../models/movie.interface';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FilterPanelComponent, MovieFilters } from '../../components/filter-panel/filter-panel.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { MovieModalComponent } from '../../components/movie-modal/movie-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    FilterPanelComponent,
    MovieCardComponent,
    MovieModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  isLoading = false;
  currentPage = 1;
  totalPages = 1;
  searchQuery = '';
  currentFilters: MovieFilters = {};
  selectedMovieId: number | null = null;

  constructor(private tmdbService: TmdbService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading = true;

    if (this.searchQuery.trim()) {
      this.searchMovies();
    } else if (this.hasActiveFilters()) {
      this.discoverMovies();
    } else {
      this.loadPopularMovies();
    }
  }

  private loadPopularMovies(): void {
    this.tmdbService.getPopularMovies(this.currentPage).subscribe({
      next: (response) => {
        this.movies = response.results;
        this.totalPages = response.total_pages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading popular movies:', error);
        this.isLoading = false;
      }
    });
  }

  private searchMovies(): void {
    this.tmdbService.searchMovies(this.searchQuery, this.currentPage).subscribe({
      next: (movies) => {
        this.movies = movies;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching movies:', error);
        this.isLoading = false;
      }
    });
  }

  private discoverMovies(): void {
    const filters = {
      ...this.currentFilters,
      page: this.currentPage
    };

    this.tmdbService.discoverMovies(filters).subscribe({
      next: (response) => {
        this.movies = response.results;
        this.totalPages = response.total_pages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error discovering movies:', error);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    this.loadMovies();
  }

  onFiltersChange(filters: MovieFilters): void {
    this.currentFilters = filters;
    this.currentPage = 1;
    this.loadMovies();
  }

  onMovieClick(movie: Movie): void {
    this.selectedMovieId = movie.id;
  }

  onCloseModal(): void {
    this.selectedMovieId = null;
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMovies();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadMovies();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private hasActiveFilters(): boolean {
    return Object.keys(this.currentFilters).some(key =>
      this.currentFilters[key as keyof MovieFilters] !== undefined
    );
  }

  getPageTitle(): string {
    if (this.searchQuery) {
      return `Resultados para "${this.searchQuery}"`;
    }
    if (this.hasActiveFilters()) {
      return 'Filmes Filtrados';
    }
    return 'Filmes Populares';
  }
}
