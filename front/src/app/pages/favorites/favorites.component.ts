import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'app/entities/auth';
import { FavoriteService } from 'app/entities/favorite';
import { IProduct } from 'app/shared/models/product.model';
import { ControlPanelConfigType } from 'app/shared/models/control-panel.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit, OnDestroy {
  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private router: Router
  ) {}

  private destroy$ = new Subject<void>();

  controlPanelConfig: ControlPanelConfigType = {
    enabled: false,
  };

  favorites: IProduct<string>[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.favoriteService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.favorites = items;
      });

    this.favoriteService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });

    // Редирект на главную страницу, если пользователь не авторизован
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (!user) this.router.navigate(['/']);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
