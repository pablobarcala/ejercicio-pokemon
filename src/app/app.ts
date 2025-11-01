import { Component, computed, inject } from '@angular/core';
import { Pokedex } from "./components/pokedex/pokedex";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { Favorites } from './services/favorites';
import { MatBadgeModule } from '@angular/material/badge';
import { FavoritesComponent } from "./components/favorites/favorites";

@Component({
  selector: 'app-root',
  imports: [
    Pokedex, 
    MatTabsModule, 
    MatIconModule, 
    MatBadgeModule, 
    FavoritesComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private favService = inject(Favorites);

  favoritesCount = computed(() => this.favService.favorites().length)
}
