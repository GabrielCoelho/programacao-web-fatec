import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { MovieListsService } from '../../services/movie-lists.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  favoritesCount = 0;
  watchedCount = 0;
  watchlistCount = 0;

  constructor(
    public favoritesService: FavoritesService,
    public movieListsService: MovieListsService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.favoritesService.favorites$.subscribe(favorites => {
      this.favoritesCount = favorites.length;
    });

    this.movieListsService.watched$.subscribe(watched => {
      this.watchedCount = watched.length;
    });

    this.movieListsService.watchlist$.subscribe(watchlist => {
      this.watchlistCount = watchlist.length;
    });
  }
}
