import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private defaultDuration = 4000; // 4 seconds

  constructor() {}

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration?: number): string {
    const id = this.generateId();
    const notification: Notification = {
      id,
      message,
      type,
      duration: duration ?? this.defaultDuration,
      dismissible: true
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-dismiss notification after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, notification.duration);
    }

    return id;
  }

  success(message: string, duration?: number): string {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): string {
    return this.show(message, 'error', duration);
  }

  info(message: string, duration?: number): string {
    return this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): string {
    return this.show(message, 'warning', duration);
  }

  dismiss(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  clear(): void {
    this.notificationsSubject.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
