import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductInterface } from '../../../core/interfaces/ProductInterface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() product!: ProductInterface;
  @Output() addToCartEvent = new EventEmitter<ProductInterface>();


  onAddToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.addToCartEvent.emit(this.product);
  }

  getStarArray(rating: number = 0): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(i < fullStars ? 1 : 0);
    }
    return stars;
  }
}
