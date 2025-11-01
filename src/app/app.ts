import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Pokedex } from "./components/pokedex/pokedex";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Pokedex],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ejercicio-pokemon');
}
