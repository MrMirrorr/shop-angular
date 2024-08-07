import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  AuthModalComponent,
  ConfirmDialogComponent,
} from 'app/shared/components';
import { AuthService } from 'app/entities/auth';
import { IUser, UserRoleEnum } from 'app/shared/models/auth.model';
import { CartService } from 'app/entities/cart';
import { FavoriteService } from 'app/entities/favorite';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private cartService: CartService,
    private favoriteService: FavoriteService
  ) {}

  private destroy$ = new Subject<void>();

  currentUser: IUser | null = null;
  isAdmin!: boolean;
  cartItemsCount!: number;
  favoritesCount!: number;

  ngOnInit(): void {
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.currentUser = user;
      this.isAdmin = user?.roleId === UserRoleEnum.Admin;
    });

    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.cartItemsCount = items.length;
      });

    this.favoriteService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe((favorites) => {
        this.favoritesCount = favorites.length;
      });
  }

  openAuthModal(): void {
    this.dialog.open(AuthModalComponent);
  }

  openProfile(): void {
    this.dialog.open(ProfileModalComponent);
  }

  logout(): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Выход',
        message: 'Вы уверены, что хотите выйти?',
        onConfirmAction: () => {
          this.authService.logout();
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
