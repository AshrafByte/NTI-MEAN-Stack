import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductInterface } from '../../../core/interfaces/ProductInterface';
import { CardComponent } from '../../ui/card/card.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);

  product: ProductInterface | null = null;
  recentlyViewed: ProductInterface[] = [];
  selectedImage: string = '';
  quantity: number = 1;
  isLoading: boolean = true;
  isAddingToCart: boolean = false;
  relatedProducts: ProductInterface[] = [];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      } else {
        console.error('No product ID found in route params');
        this.isLoading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  loadProduct(id: string | number): void {
    this.isLoading = true;
    console.log('Loading product with ID:', id);

    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        console.log('Product loaded:', product);
        if (product) {
          this.product = product;
          this.selectedImage = this.product.image || '';
          this.addToRecentlyViewed(this.product);
          this.loadRecentlyViewed();
          this.loadRelatedProducts();
        } else {
          console.error('Product not found for ID:', id);
          this.router.navigate(['/products']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  loadRelatedProducts(): void {
    if (this.product?.category) {
      this.productsService.getProducts().subscribe({
        next: (products) => {
          this.relatedProducts = products
            .filter(p => p.category === this.product?.category && p.id !== this.product?.id)
            .slice(0, 4);
        },
        error: () => {
          this.relatedProducts = [];
        }
      });
    }
  }

  addToRecentlyViewed(product: ProductInterface): void {
    let recentProducts = this.getRecentlyViewedFromStorage();


    recentProducts = recentProducts.filter(p => p.id !== product.id);


    recentProducts.unshift(product);


    recentProducts = recentProducts.slice(0, 8);


    localStorage.setItem('recentlyViewed', JSON.stringify(recentProducts));
  }

  loadRecentlyViewed(): void {
    const recentProducts = this.getRecentlyViewedFromStorage();
    this.recentlyViewed = recentProducts
      .filter(p => p.id !== this.product?.id)
      .slice(0, 4);
  }

  private getRecentlyViewedFromStorage(): ProductInterface[] {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  addToCart(): void {
    if (this.product && this.quantity > 0) {
      this.cartService.addToCart(this.product, this.quantity).subscribe({
        next: () => {
          this.quantity = 1;
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
        }
      });
    }
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }


  generateStars(rating: number = 0): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(i < fullStars ? 1 : 0);
    }
    return stars;
  }

  getDiscountPercentage(): number {
    if (!this.product?.originalPrice || !this.product?.onSale) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }
}
