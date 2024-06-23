import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AuthModalComponent,
  ConfirmDialogComponent,
} from 'app/shared/components';
import { AuthService } from 'app/entities/auth';
import { IUser } from 'app/shared/models/auth.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService, public dialog: MatDialog) {}

  currentUser: IUser | null = null;

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  openAuthModal(): void {
    this.dialog.open(AuthModalComponent);
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
