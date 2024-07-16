import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'app/entities/auth';
import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';
import { capitalizeFirstLetter } from 'app/shared/helpers';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authModalRef: MatDialogRef<AuthModalComponent>
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  private destroy$ = new Subject<void>();
  @Input() toggleFormType!: () => void;
  isLoading!: boolean;
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.authService.isAuthLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });
  }

  getErrorMessage(formControlName: string, formControlLabel: string): string {
    const control = this.loginForm.get(formControlName);

    if (control?.hasError('required')) {
      return `Поле "${capitalizeFirstLetter(
        formControlLabel
      )}" обязательно для заполнения`;
    } else if (control?.hasError('email')) {
      return 'Неверный формат email';
    } else if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Минимальная длина пароля - ${minLength} символов`;
    }

    return '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(() => {
        this.authModalRef.close();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
