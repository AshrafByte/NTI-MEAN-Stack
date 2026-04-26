import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible) {
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
           (click)="onBackdropClick($event)">

        <div class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 scale-100"
             (click)="$event.stopPropagation()">

          <div class="p-6 pb-4">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                @if (type === 'danger') {
                  <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                  </div>
                } @else if (type === 'warning') {
                  <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                  </div>
                } @else {
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                }
              </div>

              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ message }}</p>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
            <button type="button"
                    (click)="onCancel()"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              {{ cancelText }}
            </button>
            <button type="button"
                    (click)="onConfirm()"
                    [class]="getConfirmButtonClass()"
                    class="px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-enter {
      opacity: 0;
      transform: scale(0.95);
    }

    .modal-enter-active {
      opacity: 1;
      transform: scale(1);
      transition: opacity 300ms, transform 300ms;
    }

    .modal-leave-active {
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 200ms, transform 200ms;
    }
  `]
})
export class ConfirmationModalComponent {
  @Input() isVisible = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() type: 'info' | 'warning' | 'danger' = 'info';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
    this.isVisible = false;
  }

  onCancel(): void {
    this.cancelled.emit();
    this.isVisible = false;
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  getConfirmButtonClass(): string {
    switch (this.type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  }
}
