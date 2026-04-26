import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  isSubmitting = false;
  showError = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  onSubmit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.showError = true;
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.showError = false;

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          // Reload cart after login to sync with user's cart
          this.cartService.loadCartFromCookies();
          this.router.navigate(['/home']);
        } else {
          this.showError = true;
          this.errorMessage = 'Invalid email or password.';
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        this.showError = true;
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please try again later.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
        this.isSubmitting = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  dismissError(): void {
    this.showError = false;
  }
}
