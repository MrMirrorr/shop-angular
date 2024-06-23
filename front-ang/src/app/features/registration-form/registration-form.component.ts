import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'app/entities/auth';
import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';
import { capitalizeFirstLetter } from 'app/shared/helpers';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authModalRef: MatDialogRef<AuthModalComponent>
  ) {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: [
        '',
        [
          Validators.required,
          // Validators.pattern(this.registrationForm.get('password')?.value),
        ],
      ],
    });
  }

  private destroy$ = new Subject<void>();
  @Input() toggleFormType!: () => void;
  isLoading!: boolean;
  registrationForm!: FormGroup;

  ngOnInit(): void {
    this.authService.isAuthLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });
  }

  getErrorMessage(formControlName: string, formControlLabel: string): string {
    const control = this.registrationForm.get(formControlName);

    if (control?.hasError('required')) {
      return `Поле "${capitalizeFirstLetter(
        formControlLabel
      )}" обязательно для заполнения`;
    } else if (control?.hasError('email')) {
      return 'Неверный формат email';
    } else if (
      formControlName === 'fullName' &&
      control?.hasError('minlength')
    ) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Минимальная длина имени - ${minLength} символов`;
    } else if (
      formControlName === 'password' &&
      control?.hasError('minlength')
    ) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Минимальная длина пароля - ${minLength} символов`;
    } else if (control?.errors?.['pattern']) {
      return 'Пароли не совпадают';
    }
    return '';
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = {
        fullName: this.registrationForm.get('fullName')?.value,
        email: this.registrationForm.get('email')?.value,
        password: this.registrationForm.get('password')?.value,
      };

      this.authService.registration(formData).subscribe(() => {
        this.authModalRef.close();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
