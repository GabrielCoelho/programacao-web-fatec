import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieListsService } from '../../services/movie-lists.service';
import { Movie } from '../../models/movie.interface';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { MovieModalComponent } from '../../components/movie-modal/movie-modal.component';

@Component({
  selector: 'app-watched',
  standalone: true,
  imports: [
    CommonModule,
    MovieCardComponent,
    MovieModalComponent
  ],
  templateUrl: './watched.component.html',
  styleUrl: './watched.component.css'
})
export class WatchedComponent implements OnInit {
  watchedMovies: Movie[] = [];
  selectedMovieId: number | null = null;

  constructor(public movieListsService: MovieListsService) {}

  ngOnInit(): void {
    this.loadWatched();

    // Subscribe to watched changes
    this.movieListsService.watched$.subscribe(movies => {
      this.watchedMovies = movies;
    });
  }

  loadWatched(): void {
    this.watchedMovies = this.movieListsService.getWatched();
  }

  onMovieClick(movie: Movie): void {
    this.selectedMovieId = movie.id;
  }

  onCloseModal(): void {
    this.selectedMovieId = null;
  }

  clearAllWatched(): void {
    if (confirm('Tem certeza que deseja limpar todos os filmes assistidos?')) {
      this.movieListsService.clearWatched();
    }
  }
}
