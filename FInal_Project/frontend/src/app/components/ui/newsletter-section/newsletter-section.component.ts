import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="bg-blue-700 dark:bg-blue-800 py-16">
      <div class="max-w-screen-xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Stay Updated</h2>
        <p class="text-blue-100 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about new products and exclusive offers.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            [(ngModel)]="emailSubscription" 
            placeholder="Enter your email" 
            class="flex-1 px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500">
          <button 
            (click)="onSubscribe()" 
            class="text-blue-700 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 text-center whitespace-nowrap transition-colors duration-200">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./newsletter-section.component.css']
})
export class NewsletterSectionComponent {
  @Output() subscribeEvent = new EventEmitter<string>();
  
  emailSubscription: string = '';

  onSubscribe() {
    if (this.emailSubscription.trim()) {
      this.subscribeEvent.emit(this.emailSubscription);
      this.emailSubscription = '';
    }
  }
}
