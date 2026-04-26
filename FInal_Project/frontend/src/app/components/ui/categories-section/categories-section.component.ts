import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Category {
  name: string;
  value: string;
  count: number;
  icon: string;
}

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-gray-50 dark:bg-gray-800 py-16">
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
          <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our diverse range of product categories to find exactly what you're looking for.
          </p>
        </div>
        <div class="grid md:grid-cols-4 gap-6">
          @for (category of categories; track category.value) {
            <div 
              (click)="onCategoryClick(category.value)" 
              class="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-600 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 category-card">
              <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-700 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path [attr.d]="category.icon"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ category.name }}</h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">{{ category.count }} products</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./categories-section.component.css']
})
export class CategoriesSectionComponent {
  @Output() categoryClickEvent = new EventEmitter<string>();

  categories: Category[] = [
    {
      name: 'Electronics',
      value: 'electronics',
      count: 45,
      icon: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
    },
    {
      name: 'Clothing',
      value: 'clothing',
      count: 78,
      icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z'
    },
    {
      name: 'Home & Garden',
      value: 'home',
      count: 32,
      icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z'
    },
    {
      name: 'Sports',
      value: 'sports',
      count: 56,
      icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM9 16a3 3 0 11-6 0 3 3 0 016 0zM19 9a2 2 0 11-4 0 2 2 0 014 0z'
    }
  ];

  onCategoryClick(category: string) {
    this.categoryClickEvent.emit(category);
  }
}
