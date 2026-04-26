import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ProductInterface } from '../interfaces/ProductInterface';
import { NotificationService } from './notification.service';

interface ApiResponse<T> {
  status: string;
  data: T;
  results?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient, private notificationService: NotificationService) { }

  getProducts(): Observable<ProductInterface[]> {
    return this.http.get<ApiResponse<{ products: ProductInterface[] }>>(`${environment.apiUrl}/products`)
      .pipe(
        map(response => response.data.products),
        catchError(() => of([]))
      );
  }


  getAllProducts(): Observable<ProductInterface[]> {
    return this.getProducts();
  }

  searchProducts(searchTerm: string): Observable<ProductInterface[]> {
    return this.http.get<ApiResponse<{ products: ProductInterface[] }>>(`${environment.apiUrl}/products/search?q=${searchTerm}`)
      .pipe(
        map(response => response.data.products),
        catchError(() => of([]))
      );
  }

  getProductById(id: string | number): Observable<ProductInterface | undefined> {
    return this.http.get<ApiResponse<{ product: ProductInterface }>>(`${environment.apiUrl}/products/${id}`)
      .pipe(
        map(response => response.data.product),
        catchError(() => of(undefined))
      );
  }

  getProductsBySeller(sellerId: string | number): Observable<ProductInterface[]> {
    return this.http.get<ApiResponse<{ products: ProductInterface[] }>>(`${environment.apiUrl}/products/seller/${sellerId}`)
      .pipe(
        map(response => response.data.products),
        catchError(() => of([]))
      );
  }

  createProduct(product: Partial<ProductInterface>): Observable<ProductInterface> {
    return this.http.post<ApiResponse<{ product: ProductInterface }>>(`${environment.apiUrl}/products`, product)
      .pipe(
        map(response => response.data.product),
        tap(createdProduct => {
          this.notificationService.success(`Product "${createdProduct.name}" created successfully!`);
        }),
        catchError(error => {
          console.error('Create product error:', error);
          this.notificationService.error('Failed to create product. Please try again.');
          throw error;
        })
      );
  }

  // Add addProduct alias for backward compatibility
  addProduct(product: Partial<ProductInterface>): Observable<ProductInterface> {
    return this.createProduct(product);
  }

  updateProduct(id: string | number, product: Partial<ProductInterface>): Observable<ProductInterface> {
    return this.http.put<ApiResponse<{ product: ProductInterface }>>(`${environment.apiUrl}/products/${id}`, product)
      .pipe(
        map(response => response.data.product),
        tap(updatedProduct => {
          this.notificationService.success(`Product "${updatedProduct.name}" updated successfully!`);
        }),
        catchError(error => {
          console.error('Update product error:', error);
          this.notificationService.error('Failed to update product. Please try again.');
          throw error;
        })
      );
  }

  deleteProduct(id: string | number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/products/${id}`)
      .pipe(
        tap(() => {
          this.notificationService.success('Product deleted successfully!');
        }),
        catchError(error => {
          console.error('Delete product error:', error);
          this.notificationService.error('Failed to delete product. Please try again.');
          throw error;
        })
      );
  }
}
