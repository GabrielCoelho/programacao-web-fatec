import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieListsService } from '../../services/movie-lists.service';
import { Movie } from '../../models/movie.interface';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { MovieModalComponent } from '../../components/movie-modal/movie-modal.component';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    CommonModule,
    MovieCardComponent,
    MovieModalComponent
  ],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit {
  watchlistMovies: Movie[] = [];
  selectedMovieId: number | null = null;

  constructor(public movieListsService: MovieListsService) {}

  ngOnInit(): void {
    this.loadWatchlist();

    // Subscribe to watchlist changes
    this.movieListsService.watchlist$.subscribe(movies => {
      this.watchlistMovies = movies;
    });
  }

  loadWatchlist(): void {
    this.watchlistMovies = this.movieListsService.getWatchlist();
  }

  onMovieClick(movie: Movie): void {
    this.selectedMovieId = movie.id;
  }

  onCloseModal(): void {
    this.selectedMovieId = null;
  }

  clearAllWatchlist(): void {
    if (confirm('Tem certeza que deseja limpar toda a lista?')) {
      this.movieListsService.clearWatchlist();
    }
  }
}
