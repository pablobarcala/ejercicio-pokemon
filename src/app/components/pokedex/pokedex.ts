import { Component, inject, OnInit, signal } from '@angular/core';
import { Pokeapi, Pokemon } from '../../services/pokeapi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PokemonCard } from "../pokemon-card/pokemon-card";

@Component({
  selector: 'app-pokedex',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSnackBarModule,
    PokemonCard
],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.css',
})
export class Pokedex implements OnInit {
  private pokemonService = inject(Pokeapi)
  private snackBar = inject(MatSnackBar)

  pokemons = signal<Pokemon[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  
  pageSize = 20;
  pageIndex = 0;
  totalPokemons = 0;

  ngOnInit(): void {
    this.loadPokemons();
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
}
