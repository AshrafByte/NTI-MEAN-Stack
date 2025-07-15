import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Carousel} from './components/ui/carousel/carousel';
import {Home} from './components/pages/home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Angular');
}
