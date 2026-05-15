// Auth Guard — protects routes from unauthenticated access
// Checks localStorage for valid token
// Redirects to /login if not authenticated

import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return true;

  if (auth.isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};