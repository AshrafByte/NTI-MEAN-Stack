import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { ProductInterface } from '../../../core/interfaces/ProductInterface';
import { UserInterface } from '../../../core/interfaces/UserInterface';
import { OrderInterface } from '../../../core/interfaces/OrderInterface';
import { Subscription } from 'rxjs';
import { take, finalize } from 'rxjs/operators';
import { ConfirmationModalComponent } from '../../ui/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmationModalComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  currentUser: UserInterface | null = null;
  activeTab: string = 'profile';
  products: ProductInterface[] = [];
  orders: OrderInterface[] = [];
  productForm: FormGroup;
  editingProduct: ProductInterface | null = null;
  showProductForm: boolean = false;
  isLoading: boolean = false;
  isLoadingOrders: boolean = false;

  profileForm: FormGroup;
  isUpdatingProfile: boolean = false;
  showProfileSuccess: boolean = false;
  showProfileError: boolean = false;
  profileErrorMessage: string = '';

  private userSubscription?: Subscription;
  private productsLoaded = false;
  private ordersLoaded = false;

  showCancelModal = false;
  orderToCancel: OrderInterface | null = null;

  categories: string[] = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty'];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]],
      stock: ['', [Validators.required, Validators.min(0)]],
      featured: [false]
    });

    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
      this.loadTabData();
    });

    this.initializeForms();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private initializeForms(): void {
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email,
        role: this.currentUser.role
      });
    }
  }

  loadUserProducts() {
    if (!this.currentUser?.id || this.currentUser.role !== 'seller') {
      return;
    }

    if (this.isLoading || this.productsLoaded) {
      return;
    }

    this.isLoading = true;
    this.productsLoaded = true;

    this.productsService.getProductsBySeller(this.currentUser.id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (products) => {
          this.products = Array.isArray(products) ? products : [];
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.products = [];
          this.productsLoaded = false;
        }
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.loadTabData();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }

  private loadTabData(): void {
    switch (this.activeTab) {
      case 'products':
        if (!this.productsLoaded) {
          this.loadUserProducts();
        }
        break;
      case 'orders':
        if (!this.ordersLoaded) {
          this.loadUserOrders();
        }
        break;
      default:
        break;
    }
  }

  private loadUserOrders(): void {
    this.isLoadingOrders = true;
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.ordersLoaded = true;
        this.isLoadingOrders = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoadingOrders = false;
      }
    });
  }

  openProductForm(product?: ProductInterface) {
    this.editingProduct = product || null;
    this.showProductForm = true;

    if (product) {
      this.productForm.patchValue(product);
    } else {
      this.productForm.reset();
      this.productForm.patchValue({ featured: false });
    }
  }

  closeProductForm() {
    this.showProductForm = false;
    this.editingProduct = null;
    this.productForm.reset();
  }

  onSubmitProduct() {
    if (this.productForm.valid) {
      const productData = {
        ...this.productForm.value,
        sellerId: this.currentUser?.id
      };

      if (this.editingProduct) {
        this.productsService.updateProduct(this.editingProduct.id!, productData).subscribe({
          next: (updatedProduct) => {
            const index = this.products.findIndex(p => p.id === this.editingProduct!.id);
            if (index !== -1) {
              this.products[index] = updatedProduct;
            }
            this.closeProductForm();
          },
          error: (error) => {
            console.error('Error updating product:', error);
          }
        });
      } else {
        this.productsService.addProduct(productData).subscribe({
          next: (addedProduct) => {
            this.products.unshift(addedProduct);
            this.closeProductForm();
          },
          error: (error) => {
            console.error('Error adding product:', error);
          }
        });
      }
    }
  }

  deleteProduct(id: string | number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  updateProfile() {
    if (this.profileForm.valid && this.currentUser) {
      this.isUpdatingProfile = true;
      this.showProfileError = false;
      this.showProfileSuccess = false;

      const updatedUserData = {
        ...this.profileForm.value,
        id: this.currentUser.id
      };

      this.authService.updateProfile(updatedUserData).subscribe({
        next: () => {
          this.showProfileSuccess = true;
          this.isUpdatingProfile = false;

          setTimeout(() => {
            this.showProfileSuccess = false;
          }, 3000);
        },
        error: (error) => {
          this.showProfileError = true;
          this.profileErrorMessage = error.error?.message || 'Error updating profile';
          this.isUpdatingProfile = false;
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
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

  getStatusDisplayText(status: string): string {
    return this.orderService.getStatusDisplayText(status);
  }

  getPaymentStatusDisplayText(status: string): string {
    return this.orderService.getPaymentStatusDisplayText(status);
  }

  getStatusColorClass(status: string): string {
    return this.orderService.getStatusColorClass(status);
  }

  getOrderItemTotal(price: number, quantity: number): number {
    return price * quantity;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewOrderDetails(order: OrderInterface): void {
    this.router.navigate(['/order-details', order.id]);
  }

  cancelOrder(order: OrderInterface): void {
    this.orderToCancel = order;
    this.showCancelModal = true;
  }

  confirmCancelOrder(): void {
    if (this.orderToCancel) {
      this.orderService.cancelOrder(this.orderToCancel.id).subscribe({
        next: () => {
          const orderIndex = this.orders.findIndex(o => o.id === this.orderToCancel!.id);
          if (orderIndex !== -1) {
            this.orders[orderIndex].status = 'cancelled';
          }
          this.showCancelModal = false;
          this.orderToCancel = null;
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          this.showCancelModal = false;
        }
      });
    }
  }

  cancelCancelOrder(): void {
    this.showCancelModal = false;
    this.orderToCancel = null;
  }
}
