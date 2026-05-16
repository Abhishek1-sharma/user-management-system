// HTTP Interceptor — automatically attaches JWT token
// to every outgoing HTTP request as Authorization header
// This means services don't need to manually add tokens

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!isPlatformBrowser(this.platformId)) {
      return next.handle(req);
    }
    const token = this.auth.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req);
  }
}