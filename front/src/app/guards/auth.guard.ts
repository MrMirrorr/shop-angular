import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { combineLatest, map, take } from 'rxjs';
import { AuthService } from 'app/entities/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([authService.user$, authService.isAuthMeLoading$]).pipe(
    take(1),
    map(([user, isLoading]) => {
      if (!user && !isLoading) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
