import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './entities/auth';
import { SnackbarService } from './shared/services';
import { CartService } from './entities/cart';
import { FavoriteService } from './entities/favorite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private cartService: CartService,
    private favoriteService: FavoriteService
  ) {}

  private destroy$ = new Subject<void>();

  isLoading!: boolean;

  ngOnInit(): void {
    this.authService.authMe();

    this.authService.isAuthMeLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });

    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      // const prevUser = this.authService.getUser();

      // if (user && user.id !== prevUser?.id) {
      this.snackbarService.showSnackbarSuccess(
        `Приветствую, ${user?.fullName}!`
      );
      this.cartService.getCart();
      this.favoriteService.getFavorites();
      // }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
