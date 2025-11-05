import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TmdbService } from '../../services/tmdb.service';
import { Genre } from '../../models/movie.interface';

export interface MovieFilters {
  genre?: number;
  year?: number;
  sortBy?: string;
}

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.css'
})
export class FilterPanelComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<MovieFilters>();

  genres: Genre[] = [];
  selectedGenre: number | undefined;
  selectedYear: number | undefined;
  selectedSort = 'popularity.desc';

  sortOptions = [
    { value: 'popularity.desc', label: 'Mais Populares' },
    { value: 'popularity.asc', label: 'Menos Populares' },
    { value: 'vote_average.desc', label: 'Melhor Avaliados' },
    { value: 'vote_average.asc', label: 'Pior Avaliados' },
    { value: 'release_date.desc', label: 'Mais Recentes' },
    { value: 'release_date.asc', label: 'Mais Antigos' }
  ];

  years: number[] = [];

  constructor(private tmdbService: TmdbService) {
    this.generateYears();
  }

  ngOnInit(): void {
    this.loadGenres();
  }

  private generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
      this.years.push(year);
    }
  }

  private loadGenres(): void {
    this.tmdbService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
      },
      error: (error) => {
        console.error('Error loading genres:', error);
      }
    });
  }

  onFilterChange(): void {
    const filters: MovieFilters = {
      genre: this.selectedGenre,
      year: this.selectedYear,
      sortBy: this.selectedSort
    };
    this.filtersChange.emit(filters);
  }

  clearFilters(): void {
    this.selectedGenre = undefined;
    this.selectedYear = undefined;
    this.selectedSort = 'popularity.desc';
    this.onFilterChange();
  }

  hasActiveFilters(): boolean {
    return this.selectedGenre !== undefined ||
           this.selectedYear !== undefined ||
           this.selectedSort !== 'popularity.desc';
  }
}
