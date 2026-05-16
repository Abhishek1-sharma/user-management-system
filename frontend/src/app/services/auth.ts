import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.api}/login`, { username, password }).pipe(
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('username', res.username);
        }
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken() {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('token');
  }

  getRole() {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('role');
  }

  getUsername() {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('username');
  }

  isLoggedIn() { return !!this.getToken(); }
}