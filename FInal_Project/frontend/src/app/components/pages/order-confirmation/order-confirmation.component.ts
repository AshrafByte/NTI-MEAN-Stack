import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { OrderInterface } from '../../../core/interfaces/OrderInterface';
import { UserInterface } from '../../../core/interfaces/UserInterface';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  order: OrderInterface | null = null;
  currentUser: UserInterface | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
    });


    const orderId = this.route.snapshot.queryParams['orderId'];
    if (orderId) {
      this.loadOrderDetails(orderId);
    } else {
      this.error = 'Order ID not found';
      this.isLoading = false;
    }
  }

  private loadOrderDetails(orderId: string): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        this.error = 'Failed to load order details';
        this.isLoading = false;
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  viewOrderHistory(): void {
    if (this.currentUser?.role === 'user') {
      this.router.navigate(['/account'], { queryParams: { tab: 'orders' } });
    } else {

      this.router.navigate(['/account'], { queryParams: { tab: 'products' } });
    }
  }

  goToAccount(): void {
    this.router.navigate(['/account']);
  }


  getOrderItemTotal(price: number, quantity: number): number {
    return price * quantity;
  }


  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }


  getStatusDisplayText(status: string): string {
    return this.orderService.getStatusDisplayText(status);
  }


  getPaymentStatusDisplayText(status: string): string {
    return this.orderService.getPaymentStatusDisplayText(status);
  }


  getStatusColorClass(status: string): string {
    return this.orderService.getStatusColorClass(status);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://via.placeholder.com/400x300?text=No+Image';
    }
  }
}
