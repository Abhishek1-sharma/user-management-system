import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // On server side, allow through (auth.ts already handles null safely)
  if (!isPlatformBrowser(platformId)) return true;

  const allowed: string[] = route.data['roles'];
  if (allowed.includes(auth.getRole() || '')) return true;
  router.navigate(['/forbidden']);
  return false;
};