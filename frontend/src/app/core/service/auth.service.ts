import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loading = signal(false);
  currentUser = signal<any>(null);

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.checkAuth();
  }

  register(data: any) {
    return this.http.post(`${environment.apiUrl}/user/signup`, data);
  }

  login(data: any) {
    return this.http.post(`${environment.apiUrl}/user/login`, data);
  }

  saveToken(token: string, user?: any) {
    console.log("AuthService: Saving token", { type: typeof token, length: token?.length });
    console.log("AuthService: Saving user", user);
    localStorage.setItem('token', token);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.checkAuth();
  }

  checkAuth() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    console.log("AuthService: checkAuth - token exists:", !!token);

    if (token && typeof token === 'string' && token !== 'undefined' && token !== 'null') {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = userStr ? JSON.parse(userStr) : payload;
        console.log("AuthService: setting currentUser", user);
        this.currentUser.set(user);
      } catch (e) {
        console.error("AuthService: token parse error", e);
        this.logout();
      }
    } else if (token) {
      console.warn("AuthService: invalid token found, logging out");
      this.logout();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }
}
