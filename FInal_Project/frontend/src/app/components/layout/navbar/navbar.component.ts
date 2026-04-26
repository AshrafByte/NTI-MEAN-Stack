import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import {UserInterface} from '../../../core/interfaces/UserInterface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  isLoggedIn: boolean = false;
  showMobileMenu: boolean = false;
  showUserMenu: boolean = false;
  currentUser: UserInterface | null = null;

  private cartSubscription: Subscription = new Subscription();
  private authSubscription: Subscription = new Subscription();

  get userInitials(): string {
    if (this.currentUser?.name) {
      const names = this.currentUser.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    return 'U';
  }

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.cartSubscription = this.cartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });


    this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });


    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    this.showUserMenu = false;
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showUserMenu = !this.showUserMenu;
    this.showMobileMenu = false;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/home']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Simply close all dropdowns on any document click
    // The stopPropagation in toggleUserMenu will prevent this when clicking the button
    this.showUserMenu = false;
    this.showMobileMenu = false;
  }
}
