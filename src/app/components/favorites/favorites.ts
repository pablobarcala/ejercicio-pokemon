import { Component, inject, OnInit } from '@angular/core';
import { Favorites } from '../../services/favorites';
import { PokemonCard } from "../pokemon-card/pokemon-card";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-favorites',
  imports: [
    PokemonCard,
    MatIconModule
],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class FavoritesComponent implements OnInit {
  public favService = inject(Favorites);

  ngOnInit(): void {
    this.favService.loadFavorites();
  }
}
