import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { AuthService } from 'app/entities/auth/auth.service';
import { IUser } from 'app/shared/models/auth.model';
import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService) {}

  currentUser: IUser | null = null;
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  openAuthModal(): void {
    this.dialog.open(AuthModalComponent, {
      data: { modalTitle: 'Авторизация' },
    });
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
}
