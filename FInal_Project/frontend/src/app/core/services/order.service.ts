import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { OrderInterface, CreateOrderRequest, OrderResponse, OrdersResponse } from '../interfaces/OrderInterface';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }


  getOrders(): Observable<OrderInterface[]> {
    return this.http.get<OrdersResponse>(`${environment.apiUrl}/orders`)
      .pipe(
        map(response => response.data.orders),
        catchError(error => {
          console.error('Error fetching orders:', error);
          this.notificationService.error('Failed to load order history. Please try again.');
          throw error;
        })
      );
  }

  getOrderById(id: string): Observable<OrderInterface> {
    return this.http.get<OrderResponse>(`${environment.apiUrl}/orders/${id}`)
      .pipe(
        map(response => response.data.order),
        catchError(error => {
          console.error('Error fetching order details:', error);
          this.notificationService.error('Failed to load order details. Please try again.');
          throw error;
        })
      );
  }


  createOrder(orderData: CreateOrderRequest): Observable<OrderInterface> {
    return this.http.post<OrderResponse>(`${environment.apiUrl}/orders`, orderData)
      .pipe(
        map(response => response.data.order),
        tap(order => {
          this.notificationService.success(`Order ${order.orderNumber} placed successfully!`);
        }),
        catchError(error => {
          console.error('Error creating order:', error);
          const errorMessage = error.error?.message || 'Failed to place order. Please try again.';
          this.notificationService.error(errorMessage);
          throw error;
        })
      );
  }


  updateOrderStatus(id: string, status: string): Observable<OrderInterface> {
    return this.http.patch<OrderResponse>(`${environment.apiUrl}/orders/${id}/status`, { status })
      .pipe(
        map(response => response.data.order),
        tap(order => {
          this.notificationService.success(`Order status updated to ${status}`);
        }),
        catchError(error => {
          console.error('Error updating order status:', error);
          this.notificationService.error('Failed to update order status. Please try again.');
          throw error;
        })
      );
  }


  getStatusDisplayText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }


  getPaymentStatusDisplayText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'paid': 'Paid',
      'failed': 'Failed',
      'refunded': 'Refunded'
    };
    return statusMap[status] || status;
  }


  getStatusColorClass(status: string): string {
    const colorMap: { [key: string]: string } = {
      'pending': 'text-yellow-600 bg-yellow-100',
      'confirmed': 'text-blue-600 bg-blue-100',
      'processing': 'text-purple-600 bg-purple-100',
      'shipped': 'text-indigo-600 bg-indigo-100',
      'delivered': 'text-green-600 bg-green-100',
      'cancelled': 'text-red-600 bg-red-100'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  }

  // Cancel order (customer can cancel pending/confirmed orders)
  cancelOrder(id: string): Observable<OrderInterface> {
    return this.http.patch<OrderResponse>(`${environment.apiUrl}/orders/${id}/cancel`, {})
      .pipe(
        map(response => response.data.order),
        tap(order => {
          this.notificationService.success(`Order ${order.orderNumber} has been cancelled successfully!`);
        }),
        catchError(error => {
          console.error('Error cancelling order:', error);
          const errorMessage = error.error?.message || 'Failed to cancel order. Please try again.';
          this.notificationService.error(errorMessage);
          throw error;
        })
      );
  }
}
