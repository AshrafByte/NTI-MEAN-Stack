import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductInterface } from '../../../core/interfaces/ProductInterface';
import { ProductsGridComponent } from '../../ui/products-grid/products-grid.component';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductsGridComponent],
  template: `
    <section class="bg-white dark:bg-gray-900 py-16">
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {{ title }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            {{ subtitle }}
          </p>
        </div>

        <app-products-grid
          [products]="displayProducts"
          [emptyMessage]="'No featured products available at the moment.'"
          (addToCartEvent)="onAddToCart($event)">
        </app-products-grid>

        @if (showViewAllButton && allProducts.length > displayProducts.length) {
          <div class="text-center mt-12">
            <a
              routerLink="/products"
              class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-200">
              View All Products
              <svg class="w-4 h-4 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
            </a>
          </div>
        }
      </div>
    </section>
  `,
  styleUrls: ['./featured-products.component.css']
})
export class FeaturedProductsComponent implements OnInit, OnChanges {
  @Input() allProducts: ProductInterface[] = [];
  @Input() maxProducts: number = 8;
  @Input() title: string = 'Featured Products';
  @Input() subtitle: string = 'Discover our handpicked selection of trending and popular products.';
  @Input() showViewAllButton: boolean = true;
  @Input() filterBy: 'featured' | 'latest' | 'popular' | 'discounted' = 'featured';

  @Output() addToCartEvent = new EventEmitter<ProductInterface>();

  displayProducts: ProductInterface[] = [];

  ngOnInit() {
    this.updateDisplayProducts();
  }

  ngOnChanges() {
    this.updateDisplayProducts();
  }

  private updateDisplayProducts() {
    let filteredProducts = [...this.allProducts];


    switch (this.filterBy) {
      case 'featured':
        filteredProducts = filteredProducts.filter(p => (p.rating || 0) >= 4.5);
        break;
      case 'latest':
        filteredProducts = filteredProducts.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        break;
      case 'popular':
        filteredProducts = filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discounted':
        filteredProducts = filteredProducts.filter(p => p.price < 100);
        break;
    }

    this.displayProducts = filteredProducts.slice(0, this.maxProducts);
  }

  onAddToCart(product: ProductInterface) {
    this.addToCartEvent.emit(product);
  }
}
