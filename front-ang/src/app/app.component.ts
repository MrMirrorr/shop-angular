import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './entities/auth';
import { SnackbarService } from './shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService
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
      if (user) {
        this.snackbarService.showSnackbarSuccess(
          `Приветствую, ${user.fullName}!`
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
