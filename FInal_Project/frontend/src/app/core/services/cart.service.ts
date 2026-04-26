import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem, Cart } from '../interfaces/CartInterface';
import { ProductInterface } from '../interfaces/ProductInterface';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private readonly CART_COOKIE_NAME = 'shopping_cart';
  private readonly CART_COUNT_COOKIE_NAME = 'cart_count';

  constructor(private notificationService: NotificationService) {
    this.loadCartFromCookies();
  }

  // Add public method to reload cart
  loadCartFromCookies(): void {
    const cartItems = this.getCartItemsFromCookies();
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    this.cartItemsSubject.next(cartItems);
    this.cartCountSubject.next(totalCount);
  }

  private getCartItemsFromCookies(): CartItem[] {
    try {
      const cartCookie = this.getCookie(this.CART_COOKIE_NAME);
      if (cartCookie) {
        return JSON.parse(decodeURIComponent(cartCookie));
      }
    } catch (error) {
      console.error('Error parsing cart from cookies:', error);
    }
    return [];
  }

  private saveCartToCookies(cartItems: CartItem[]): void {
    const cartJson = JSON.stringify(cartItems);
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Set cart items cookie (expires in 30 days)
    this.setCookie(this.CART_COOKIE_NAME, encodeURIComponent(cartJson), 30);

    this.setCookie(this.CART_COUNT_COOKIE_NAME, totalCount.toString(), 30);

    this.cartItemsSubject.next(cartItems);
    this.cartCountSubject.next(totalCount);
  }

  addToCart(product: ProductInterface, quantity: number = 1): Observable<any> {
    const cartItems = this.getCartItemsFromCookies();
    const existingItemIndex = cartItems.findIndex(item => item.productId === product.id?.toString());

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += quantity;
      cartItems[existingItemIndex].total = cartItems[existingItemIndex].price * cartItems[existingItemIndex].quantity;
      this.notificationService.success(`Updated ${product.name} quantity in cart!`);
    } else {
      const newCartItem: CartItem = {
        productId: product.id?.toString() || '',
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
        stock: product.stock,
        total: product.price * quantity
      };
      cartItems.push(newCartItem);
      this.notificationService.success(`${product.name} added to cart successfully!`);
    }

    this.saveCartToCookies(cartItems);
    return of({ status: 'success', message: 'Product added to cart' });
  }

  updateQuantity(productId: string, quantity: number): Observable<any> {
    const cartItems = this.getCartItemsFromCookies();
    const itemIndex = cartItems.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      const itemName = cartItems[itemIndex].name;
      if (quantity <= 0) {
        cartItems.splice(itemIndex, 1);
        this.notificationService.info(`${itemName} removed from cart`);
      } else {
        cartItems[itemIndex].quantity = quantity;
        cartItems[itemIndex].total = cartItems[itemIndex].price * quantity;
        this.notificationService.success(`${itemName} quantity updated`);
      }
      this.saveCartToCookies(cartItems);
    }

    return of({ status: 'success', message: 'Cart updated' });
  }

  removeFromCart(productId: string): Observable<any> {
    const cartItems = this.getCartItemsFromCookies();
    const itemToRemove = cartItems.find(item => item.productId === productId);
    const filteredItems = cartItems.filter(item => item.productId !== productId);

    if (itemToRemove) {
      this.notificationService.info(`${itemToRemove.name} removed from cart`);
    }

    this.saveCartToCookies(filteredItems);
    return of({ status: 'success', message: 'Item removed from cart' });
  }

  clearCart(): Observable<any> {
    this.saveCartToCookies([]);
    this.notificationService.info('Cart cleared successfully');
    return of({ status: 'success', message: 'Cart cleared' });
  }


  clearCartAfterOrder(): void {
    this.saveCartToCookies([]);
  }

  getCart(): Observable<Cart> {
    const items = this.getCartItemsFromCookies();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.total, 0);

    const cart: Cart = {
      id: 'local_cart',
      items: items,
      totalItems: totalItems,
      totalPrice: totalPrice
    };

    return of(cart);
  }

  getCartSubtotal(): number {
    const items = this.cartItemsSubject.value;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemCount(): number {
    return this.cartCountSubject.value;
  }

  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}
