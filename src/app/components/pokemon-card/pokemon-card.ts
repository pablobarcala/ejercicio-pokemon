import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Pokemon } from '../../services/pokeapi';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Favorites } from '../../services/favorites';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pokemon-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css',
})
export class PokemonCard {
  @Input() pokemon: Pokemon | null = null;
  private favService = inject(Favorites);
  private snackBar = inject(MatSnackBar);
  
  toggleFavorite(pokemon: Pokemon): void {
    if (this.favService.isFavorite(pokemon.id)) {
      this.favService.removeFavorite(pokemon.id);
      this.showMessage("Removido de favoritos");
    } else {
      this.favService.addFavorite(pokemon);
      this.showMessage("❤️ Agregado a favoritos");
    }
  }

  isFavorite(pokemonId: number): boolean {
    return this.favService.isFavorite(pokemonId);
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  capitalize(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return colors[type] || '#777';
  }
}
