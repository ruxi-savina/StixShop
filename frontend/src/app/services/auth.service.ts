import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'stixshop_token';
  private _isLoggedIn = signal(!!localStorage.getItem(this.tokenKey));

  isLoggedIn = this._isLoggedIn.asReadonly();
  isAdmin = computed(() => this._isLoggedIn());

  constructor(private http: HttpClient) {}

  async login(password: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ access_token: string }>(
          `${environment.apiUrl}/auth/login`,
          { password },
        ),
      );
      localStorage.setItem(this.tokenKey, res.access_token);
      this._isLoggedIn.set(true);
      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
