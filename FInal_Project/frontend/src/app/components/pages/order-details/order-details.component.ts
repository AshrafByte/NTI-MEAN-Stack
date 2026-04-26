import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { OrderInterface } from '../../../core/interfaces/OrderInterface';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order: OrderInterface | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrderDetails(orderId);
    } else {
      this.error = 'Invalid order ID';
      this.isLoading = false;
    }
  }

  loadOrderDetails(orderId: string): void {
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

  goBackToOrders(): void {
    this.router.navigate(['/account'], { queryParams: { tab: 'orders' } });
  }

  cancelOrder(): void {
    if (this.order && (this.order.status === 'pending' || this.order.status === 'confirmed')) {
      if (confirm(`Are you sure you want to cancel order #${this.order.orderNumber}?`)) {
        this.orderService.cancelOrder(this.order.id).subscribe({
          next: (updatedOrder) => {
            this.order = updatedOrder;
          },
          error: (error) => {
            console.error('Error cancelling order:', error);
          }
        });
      }
    }
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getOrderItemTotal(price: number, quantity: number): number {
    return price * quantity;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://via.placeholder.com/400x300?text=No+Image';
    }
  }
}
