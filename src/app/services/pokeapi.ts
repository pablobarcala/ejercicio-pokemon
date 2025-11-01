import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

export interface Pokemon {
  id: number
  name: string
  image: string
  types: string[]
}

interface PokeApiResponse {
  count: number
  results: { name: string; url: string }[] 
}

interface PokemonDetail {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: { other: { 'official-artwork': { front_default: string } } };
}

@Injectable({
  providedIn: 'root',
})
export class Pokeapi {
  private readonly API_URL = 'https://pokeapi.co/api/v2';
  
  favorites = signal<number[]>([]);

  constructor(private http: HttpClient) {
    // this.loadFavoritesFromLocalStorage();
  }

  getPokemonList(offset: number, limit: number): Observable<{ pokemons: Pokemon[], total: number }> {
    return this.http.get<PokeApiResponse>(`${this.API_URL}/pokemon?offset=${offset}&limit=${limit}`)
      .pipe(
        switchMap(response => {
          const requests = response.results.map((pokemon: any) => this.getPokemonByName(pokemon.name));

          return forkJoin(requests).pipe(
            map(pokemons => ({
              pokemons: pokemons.filter(p => p !== null) as Pokemon[],
              total: response.count
            }))
          )
        }),
        map(obs => obs as any)
      ) as Observable<{ pokemons: Pokemon[], total: number }>;
  }

  private getPokemonByName(name: string): Observable<Pokemon | null> {
    return this.http.get<PokemonDetail>(`${this.API_URL}/pokemon/${name}`)
      .pipe(
        map(data => ({
          id: data.id,
          name: data.name,
          image: data.sprites.other['official-artwork'].front_default,
          types: data.types.map(t => t.type.name)
        })),
        catchError(() => of(null))
      );
  }

  searchPokemonByName(name: string): Observable<Pokemon | null> {
    return this.getPokemonByName(name.toLowerCase());
  }

  

  // Manejar favoritos
  // toggleFavorite(pokemonId: number): void {
  //   const currentFavorites = this.favorites();
  //   const index = currentFavorites.indexOf(pokemonId);
    
  //   if (index > -1) {
  //     // Remover de favoritos
  //     this.favorites.set(currentFavorites.filter((id: any) => id !== pokemonId));
  //   } else {
  //     // Agregar a favoritos
  //     this.favorites.set([...currentFavorites, pokemonId]);
  //   }
    
  //   this.saveFavoritesToLocalStorage();
  // }

  // isFavorite(pokemonId: number): boolean {
  //   return this.favorites().includes(pokemonId);
  // }

  // Guardar favoritos en localStorage (versión básica sin Firebase)
  // private saveFavoritesToLocalStorage(): void {
  //   localStorage.setItem('pokemonFavorites', JSON.stringify(this.favorites()));
  // }

  // private loadFavoritesFromLocalStorage(): void {
  //   const saved = localStorage.getItem('pokemonFavorites');
  //   if (saved) {
  //     this.favorites.set(JSON.parse(saved));
  //   }
  // }

  // Obtener lista de favoritos con sus detalles
  // getFavoritePokemons(): Observable<Pokemon[]> {
  //   const favoriteIds = this.favorites();
    
  //   if (favoriteIds.length === 0) {
  //     return of([]);
  //   }

  //   const requests = favoriteIds.map((id: any) => 
  //     this.http.get<PokemonDetail>(`${this.API_URL}/pokemon/${id}`)
  //       .pipe(
  //         map(data => ({
  //           id: data.id,
  //           name: data.name,
  //           image: data.sprites.other['official-artwork'].front_default,
  //           types: data.types.map(t => t.type.name)
  //         })),
  //         catchError(() => of(null))
  //       )
  //   );

  //   return forkJoin(requests).pipe(
  //     map((pokemons: any) => pokemons.filter((p: any) => p !== null) as Pokemon[])
  //   );
  // }
}
