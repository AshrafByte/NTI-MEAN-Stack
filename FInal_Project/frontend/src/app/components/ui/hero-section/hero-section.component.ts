import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {{ title }}
          </h1>
          @if (subtitle) {
            <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {{ subtitle }}
            </p>
          }
          @if (showButton) {
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                [href]="buttonLink"
                class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                {{ buttonText }}
              </a>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent {
  @Input() title: string = 'Welcome to Our Store';
  @Input() subtitle: string = 'Discover amazing products at great prices';
  @Input() showButton: boolean = true;
  @Input() buttonText: string = 'Shop Now';
  @Input() buttonLink: string = '/products';
}
