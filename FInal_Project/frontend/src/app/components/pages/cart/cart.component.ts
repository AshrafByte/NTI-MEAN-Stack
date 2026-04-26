import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartItem } from '../../../core/interfaces/CartInterface';
import { CreateOrderRequest, ShippingAddress } from '../../../core/interfaces/OrderInterface';
import { HeroSectionComponent } from '../../ui/hero-section/hero-section.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, HeroSectionComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  isLoading = false;
  isPlacingOrder = false;
  showCheckoutForm = false;
  shippingForm: FormGroup;
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.shippingForm = this.fb.group({
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: [''],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ['Egypt', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCart();
    this.cartSubscription = this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      this.cartItems = items;
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.loadCartFromCookies();
    this.isLoading = false;
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartItems = [];
      },
      error: (error: any) => {
        console.error('Error clearing cart:', error);
      }
    });
  }

  updateQuantityByProductId(productId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItemByProductId(productId);
      return;
    }

    this.cartService.updateQuantity(productId, quantity).subscribe({
      next: () => {
        const item = this.cartItems.find(i => i.productId === productId);
        if (item) {
          item.quantity = quantity;
        }
      },
      error: (error: any) => {
        console.error('Error updating quantity:', error);
      }
    });
  }

  onQuantityChange(productId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const quantity = parseInt(target.value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      this.updateQuantityByProductId(productId, quantity);
    }
  }

  removeItemByProductId(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(i => i.productId !== productId);
      },
      error: (error: any) => {
        console.error('Error removing item:', error);
      }
    });
  }

  getCartSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTax(): number {
    return this.getCartSubtotal() * 0.1; // 10% tax
  }

  getTotal(): number {
    return this.getCartSubtotal() + this.getTax();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.shippingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.shippingForm.get(fieldName);
    if (field?.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['pattern']) return `Invalid ${fieldName} format`;
    }
    return '';
  }

  cancelCheckout(): void {
    this.showCheckoutForm = false;
    this.shippingForm.reset({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Egypt'
    });
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(item);
      return;
    }

    this.cartService.updateQuantity(item.productId, quantity).subscribe({
      next: () => {
        item.quantity = quantity;
      },
      error: (error: any) => {
        console.error('Error updating quantity:', error);
      }
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(i => i.productId !== item.productId);
      },
      error: (error: any) => {
        console.error('Error removing item:', error);
      }
    });
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get total(): number {
    return this.subtotal;
  }

  proceedToCheckout(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
        return;
      }
      this.showCheckoutForm = true;
    });
  }

  placeOrder(): void {
    if (this.shippingForm.valid && this.cartItems.length > 0) {
      this.isPlacingOrder = true;

      const shippingAddress: ShippingAddress = this.shippingForm.value;
      const orderData: CreateOrderRequest = {
        cartItems: this.cartItems,
        shippingAddress
      };

      this.orderService.createOrder(orderData).subscribe({
        next: (order) => {
          this.cartService.clearCart().subscribe({
            next: () => {
              this.router.navigate(['/order-confirmation'], {
                queryParams: { orderId: order.id }
              });
            },
            error: (error: any) => {
              console.error('Error clearing cart:', error);
              this.isPlacingOrder = false;
            }
          });
        },
        error: (error: any) => {
          console.error('Error placing order:', error);
          this.isPlacingOrder = false;
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.shippingForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['pattern']) return `Invalid ${fieldName} format`;
    }
    return '';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://via.placeholder.com/400x300?text=No+Image';
    }
  }
}
