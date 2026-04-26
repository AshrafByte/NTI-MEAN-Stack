import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { NotificationComponent } from './components/ui/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NotificationComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar></app-navbar>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
      <app-notification></app-notification>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'Final-Project';
}
