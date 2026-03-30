import { Component, signal, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-modal.component.html',
  styleUrl: './admin-modal.component.scss',
})
export class AdminModalComponent {
  isOpen = signal(false);
  password = signal('');
  error = signal('');
  loading = signal(false);

  constructor(private authService: AuthService) {}

  @HostListener('window:open-admin-modal')
  onOpenModal() {
    this.isOpen.set(true);
    this.password.set('');
    this.error.set('');
  }

  close() {
    this.isOpen.set(false);
    this.password.set('');
    this.error.set('');
  }

  async submit() {
    this.loading.set(true);
    this.error.set('');

    const success = await this.authService.login(this.password());

    this.loading.set(false);

    if (success) {
      this.close();
    } else {
      this.error.set('Invalid password');
    }
  }
}
