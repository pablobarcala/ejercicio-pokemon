import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Pokeapi, Pokemon } from '../../services/pokeapi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Favorites } from '../../services/favorites';

@Component({
  selector: 'app-pokedex',
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatBadgeModule
  ],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.css',
})
export class Pokedex implements OnInit {
  private pokemonService = inject(Pokeapi)
  public favService = inject(Favorites)

  pokemons = signal<Pokemon[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  
  pageSize = 20;
  pageIndex = 0;
  totalPokemons = 0;
  
  favoritesCount = computed(() => this.favService.favorites().length);

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadPokemons();
    this.favService.loadFavorites();
  }

  loadPokemons(): void {
    this.loading.set(true);
    const offset = this.pageIndex * this.pageSize;
    
    this.pokemonService.getPokemonList(offset, this.pageSize)
      .subscribe({
        next: (data) => {
          this.pokemons.set(data.pokemons);
          this.totalPokemons = data.total;
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.showMessage('Error al cargar los Pokémon');
        }
      });
  }

  searchPokemon(): void {
    const term = this.searchTerm().trim();
    
    if (!term) {
      this.loadPokemons();
      return;
    }

    this.loading.set(true);
    
    this.pokemonService.searchPokemonByName(term)
      .subscribe({
        next: (pokemon) => {
          if (pokemon) {
            this.pokemons.set([pokemon]);
            this.totalPokemons = 1;
          } else {
            this.pokemons.set([]);
            this.showMessage('Pokémon no encontrado');
          }
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.showMessage('Error en la búsqueda');
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPokemons();
  }

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

  clearSearch(): void {
    this.searchTerm.set('');
    this.pageIndex = 0;
    this.loadPokemons();
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
