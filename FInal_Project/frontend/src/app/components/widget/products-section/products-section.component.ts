import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductInterface } from '../../../core/interfaces/ProductInterface';
import { CardComponent } from '../../ui/card/card.component';

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.css']
})
export class ProductsSectionComponent {
  @Input() products: ProductInterface[] = [];
  @Input() filteredProducts: ProductInterface[] = [];
  @Input() searchTerm: string = '';
  @Input() selectedCategory: string = '';
  @Input() sortBy: string = 'name';
  @Input() showFilters: boolean = true;
  @Input() showCategories: boolean = true;
  @Input() showNewsletter: boolean = true;
  @Input() title: string = 'Our Products';
  @Input() subtitle: string = 'Discover our carefully curated collection of high-quality products designed to meet your every need.';

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() selectedCategoryChange = new EventEmitter<string>();
  @Output() sortByChange = new EventEmitter<string>();
  @Output() filterProductsEvent = new EventEmitter<void>();
  @Output() sortProductsEvent = new EventEmitter<void>();
  @Output() addToCartEvent = new EventEmitter<ProductInterface>();
  @Output() categoryClickEvent = new EventEmitter<string>();
  @Output() subscribeEvent = new EventEmitter<string>();

  emailSubscription: string = '';

  categories = [
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
      icon: 'M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 12a3 3 0 100-6 3 3 0 000 6z'
    },
    {
      name: 'Sports',
      value: 'sports',
      count: 56,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];

  onSearchTermChange(value: string) {
    this.searchTerm = value;
    this.searchTermChange.emit(value);
    this.filterProductsEvent.emit();
  }

  onCategoryChange(value: string) {
    this.selectedCategory = value;
    this.selectedCategoryChange.emit(value);
    this.filterProductsEvent.emit();
  }

  onSortByChange(value: string) {
    this.sortBy = value;
    this.sortByChange.emit(value);
    this.sortProductsEvent.emit();
  }

  onAddToCart(product: ProductInterface) {
    this.addToCartEvent.emit(product);
  }

  onCategoryClick(categoryValue: string) {
    this.categoryClickEvent.emit(categoryValue);
  }

  onSubscribe() {
    if (this.emailSubscription.trim()) {
      this.subscribeEvent.emit(this.emailSubscription);
      this.emailSubscription = '';
    }
  }
}
