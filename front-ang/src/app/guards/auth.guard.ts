import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/entities/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    router.navigate(['/']);
  }

  return isAuthenticated;
};