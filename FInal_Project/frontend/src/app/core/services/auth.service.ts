import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserInterface } from '../interfaces/UserInterface';
import { NotificationService } from './notification.service';

interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: UserInterface;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserInterface | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private notificationService: NotificationService) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearStoredAuth();
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.setToken(response.token);
          this.setCurrentUser(response.data.user);
          this.notificationService.success(`Welcome back, ${response.data.user.name}!`);
        } else {
          this.notificationService.error('Login failed. Please check your credentials.');
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        this.notificationService.error('Login failed. Please try again.');
        return of({ status: 'error', token: '', data: { user: {} as UserInterface } });
      })
    );
  }

  signup(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/signup`, userData).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.setToken(response.token);
          this.setCurrentUser(response.data.user);
          this.notificationService.success(`Account created successfully! Welcome, ${response.data.user.name}!`);
        } else {
          this.notificationService.error('Signup failed. Please try again.');
        }
      }),
      catchError(error => {
        console.error('Signup error:', error);
        this.notificationService.error('Signup failed. Please check your information and try again.');
        return of({ status: 'error', token: '', data: { user: {} as UserInterface } });
      })
    );
  }

  logout(): void {
    const currentUser = this.getCurrentUser();
    this.clearStoredAuth();
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.notificationService.info(`Goodbye, ${currentUser?.name || 'User'}! You have been logged out.`);
  }

  updateProfile(userData: Partial<UserInterface>): Observable<any> {
    return this.http.put<AuthResponse>(`${environment.apiUrl}/auth/profile`, userData).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.setCurrentUser(response.data.user);
          this.notificationService.success('Profile updated successfully!');
        } else {
          this.notificationService.error('Failed to update profile. Please try again.');
        }
      }),
      catchError(error => {
        console.error('Profile update error:', error);
        this.notificationService.error('Failed to update profile. Please try again.');
        return of({ status: 'error', token: '', data: { user: {} as UserInterface } });
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private setCurrentUser(user: UserInterface): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
  }

  private clearStoredAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): UserInterface | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
}
