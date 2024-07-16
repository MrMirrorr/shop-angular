import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { combineLatest, map, take } from 'rxjs';
import { AuthService } from 'app/entities/auth';
import { UserRoleEnum } from 'app/shared/models/auth.model';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([authService.user$, authService.isAuthMeLoading$]).pipe(
    take(1),
    map(([user, isLoading]) => {
      if (!user && !isLoading) {
        router.navigate(['/']);
        return false;
      }
      if (user && user.roleId !== UserRoleEnum.Admin) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
