import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  constructor(public authService: AuthService) {}

  showAdminModal = signal(false);

  openAdminModal() {
    this.showAdminModal.set(true);
    window.dispatchEvent(new CustomEvent('open-admin-modal'));
  }

  logout() {
    this.authService.logout();
  }
}
