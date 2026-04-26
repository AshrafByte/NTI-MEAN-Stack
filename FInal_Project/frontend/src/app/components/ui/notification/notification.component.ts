import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div
        *ngFor="let notification of notifications; trackBy: trackByFn"
        class="notification"
        [ngClass]="getNotificationClass(notification.type)"
      >
        <div class="notification-content">
          <div class="notification-icon">
            <svg *ngIf="notification.type === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <svg *ngIf="notification.type === 'error'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <svg *ngIf="notification.type === 'info'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <svg *ngIf="notification.type === 'warning'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <p class="notification-message">{{ notification.message }}</p>
          <button
            *ngIf="notification.dismissible"
            (click)="dismiss(notification.id)"
            class="notification-close"
            type="button"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      width: 100%;
    }

    .notification {
      margin-bottom: 12px;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
      transform: translateX(100%);
      animation: slideIn 0.3s ease-out forwards;
    }

    .notification.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .notification.error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .notification.info {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }

    .notification.warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .notification-content {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      gap: 12px;
    }

    .notification-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 4px;
    }

    .notification-message {
      flex: 1;
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      padding-top: 2px;
    }

    .notification-close {
      flex-shrink: 0;
      background: none;
      border: none;
      color: currentColor;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
      opacity: 0.8;
    }

    .notification-close:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    .notification.removing {
      animation: slideOut 0.3s ease-in forwards;
    }

    /* Mobile responsiveness */
    @media (max-width: 640px) {
      .notification-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }

      .notification-content {
        padding: 14px;
      }

      .notification-message {
        font-size: 13px;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      (notifications: Notification[]) => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  getNotificationClass(type: string): string {
    return type;
  }

  trackByFn(index: number, item: Notification): string {
    return item.id;
  }
}
