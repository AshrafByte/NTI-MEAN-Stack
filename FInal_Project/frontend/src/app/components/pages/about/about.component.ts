import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroSectionComponent } from '../../ui/hero-section/hero-section.component';

@Component({
  selector: 'app-about',
  imports: [
    RouterLink,
    HeroSectionComponent
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
