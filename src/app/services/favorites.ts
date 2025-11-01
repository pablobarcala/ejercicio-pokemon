import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { Pokemon } from './pokeapi';
import { setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class Favorites {
  private firestore = inject(Firestore)
  favorites = signal<Pokemon[]>([]);
  private colRef = collection(this.firestore, 'favorites')

  loadFavorites(): void {
    collectionData(this.colRef, { idField: 'id' }).subscribe({
      next: (data) => this.favorites.set(data as Pokemon[])
    })
  }

  async addFavorite(pokemon: Pokemon) {
    const exists = this.favorites().some(p => p.id === pokemon.id);
    if (exists) return

    const docRef = doc(this.firestore, 'favorites', pokemon.id.toString());
    await setDoc(docRef, pokemon)
  }

  async removeFavorite(pokemonId: number) {
    const ref = doc(this.firestore, 'favorites', pokemonId.toString());
    await deleteDoc(ref);
  }

  isFavorite(id: number): boolean {
    return this.favorites().some(p => p.id == id);
  }
}
