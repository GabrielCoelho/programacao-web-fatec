import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { Movie } from '../../models/movie.interface';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { MovieModalComponent } from '../../components/movie-modal/movie-modal.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MovieCardComponent,
    MovieModalComponent
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favorites: Movie[] = [];
  selectedMovieId: number | null = null;

  constructor(public favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.loadFavorites();

    // Subscribe to favorites changes
    this.favoritesService.favorites$.subscribe(favorites => {
      this.favorites = favorites;
    });
  }

  loadFavorites(): void {
    this.favorites = this.favoritesService.getFavorites();
  }

  onMovieClick(movie: Movie): void {
    this.selectedMovieId = movie.id;
  }

  onCloseModal(): void {
    this.selectedMovieId = null;
  }

  clearAllFavorites(): void {
    if (confirm('Tem certeza que deseja remover todos os favoritos?')) {
      this.favoritesService.clearFavorites();
    }
  }
}
