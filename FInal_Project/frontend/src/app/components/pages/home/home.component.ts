import { Component, OnInit } from '@angular/core';
import { CarouselComponent } from "../../ui/carousel/carousel.component";
import { FeaturedProductsComponent } from '../../widget/featured-products/featured-products.component';
import { CategoriesSectionComponent } from '../../ui/categories-section/categories-section.component';
import { NewsletterSectionComponent } from '../../ui/newsletter-section/newsletter-section.component';
import { ProductsService } from '../../../core/services/products.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductInterface } from '../../../core/interfaces/ProductInterface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    CarouselComponent,
    FeaturedProductsComponent,
    CategoriesSectionComponent,
    NewsletterSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  products: ProductInterface[] = [];

  constructor(
    private _ProductService: ProductsService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this._ProductService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  onAddToCart(product: ProductInterface) {
    this.cartService.addToCart(product, 1).subscribe({
      next: () => {

      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }

  onCategoryClick(category: string) {

    this.router.navigate(['/products'], { queryParams: { category } });
  }

  // I will implement it later ISA
  onNewsletterSubscribe(email: string) {
    console.log('Newsletter subscription:', email);
  }
}
