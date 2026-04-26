import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  };

  isSubmitting = false;
  showError = false;
  showSuccess = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(): void {

    this.showError = false;
    this.showSuccess = false;


    if (!this.signupData.firstName || !this.signupData.lastName ||
        !this.signupData.email || !this.signupData.password ||
        !this.signupData.confirmPassword) {
      this.showError = true;
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.showError = true;
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.signupData.password.length < 6) {
      this.showError = true;
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    if (!this.signupData.agreeToTerms) {
      this.showError = true;
      this.errorMessage = 'You must agree to the terms and conditions.';
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.signupData.email.trim())) {
      this.showError = true;
      this.errorMessage = 'Please enter a valid email address (e.g., user@example.com).';
      return;
    }


    const fullName = `${this.signupData.firstName.trim()} ${this.signupData.lastName.trim()}`;
    if (fullName.length < 2 || fullName.length > 50) {
      this.showError = true;
      this.errorMessage = 'Name must be between 2-50 characters.';
      return;
    }

    this.isSubmitting = true;


    const userData = {
      name: fullName,
      email: this.signupData.email.trim().toLowerCase(),
      password: this.signupData.password,
      role: 'user'
    };

    this.authService.signup(userData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.showSuccess = true;
          this.successMessage = 'Account created successfully! You are now logged in.';

          // Redirect to home after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        } else {
          this.showError = true;
          this.errorMessage = 'Signup failed. Please try again.';
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        this.showError = true;

        if (error.error?.errors && Array.isArray(error.error.errors)) {
          const validationErrors = error.error.errors.map((err: any) => err.msg).join(', ');
          this.errorMessage = `${validationErrors}`;
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid data provided. Please check your email format and try again.';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check if the backend is running.';
        } else {
          this.errorMessage = 'Signup failed. Please try again.';
        }
        this.isSubmitting = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  dismissError(): void {
    this.showError = false;
  }

  getPasswordStrength(): { strength: string; color: string; width: string } {
    const password = this.signupData.password;
    if (!password) return { strength: '', color: '', width: '0%' };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 2) return { strength: 'Weak', color: 'bg-red-500', width: '25%' };
    if (score < 4) return { strength: 'Fair', color: 'bg-yellow-500', width: '50%' };
    if (score < 5) return { strength: 'Good', color: 'bg-blue-500', width: '75%' };
    return { strength: 'Strong', color: 'bg-green-500', width: '100%' };
  }
}
