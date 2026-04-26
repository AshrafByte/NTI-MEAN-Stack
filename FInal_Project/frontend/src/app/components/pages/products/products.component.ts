import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../core/services/products.service';
import { ProductInterface } from '../../../core/interfaces/ProductInterface';
import { ProductsGridComponent } from '../../ui/products-grid/products-grid.component';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductsGridComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: ProductInterface[] = [];
  filteredProducts: ProductInterface[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  searchTerm: string = '';
  sortBy: string = 'name';
  isLoading: boolean = true;

  constructor(private productsService: ProductsService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.extractCategories();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  extractCategories(): void {
    const categorySet = new Set(this.products.map(p => p.category));
    this.categories = Array.from(categorySet);
  }

  onSearchTermChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.onSearch();
  }

  onSelectedCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.onCategoryChange();
  }

  onSortByChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.onSortChange();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.products];


    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }


    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    this.filteredProducts = filtered;
  }

  onAddToCart(product: ProductInterface): void {
    this.cartService.addToCart(product, 1).subscribe({
      next: () => {
        console.log('Product added to cart:', product);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }
}
