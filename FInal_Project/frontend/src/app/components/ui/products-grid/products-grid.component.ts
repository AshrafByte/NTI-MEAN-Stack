import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { ProductInterface } from '../../../core/interfaces/ProductInterface';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="max-w-screen-xl mx-auto px-4">
      <!-- Results Info -->
      <div class="mb-8">
        <p class="text-gray-600 dark:text-gray-300">
          Showing {{ products.length }} products
        </p>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        @for (product of products; track product.id) {
          <div class="flex">
            <app-product-card
              [product]="product"
              (addToCartEvent)="onAddToCart($event)"
              class="w-full">
            </app-product-card>
          </div>
        }
      </div>

      <!-- No Results Message -->
      @if (products.length === 0) {
        <div class="text-center py-16">
          <div class="text-gray-500 dark:text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 12a3 3 0 100-6 3 3 0 000 6z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
          <p class="text-gray-600 dark:text-gray-300">{{ emptyMessage || 'Try adjusting your search or filter criteria.' }}</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./products-grid.component.css']
})
export class ProductsGridComponent {
  @Input() products: ProductInterface[] = [];
  @Input() emptyMessage: string = '';
  @Output() addToCartEvent = new EventEmitter<ProductInterface>();

  onAddToCart(product: ProductInterface) {
    this.addToCartEvent.emit(product);
  }
}
