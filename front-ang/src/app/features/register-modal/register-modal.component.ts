import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'app/entities/auth/auth.service';
import { capitalizeFirstLetter } from 'app/shared/helpers';
import { IAuthModalData } from 'app/shared/models/auth-modal.model';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss',
})
export class RegisterModalComponent {
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAuthModalData,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: [
        '',
        [
          Validators.required,
          Validators.pattern(this.registerForm.get('password')?.value),
        ],
      ],
    });
  }

  isLoading!: boolean;
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.authService.isAuthLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  getErrorMessage(formControlName: string, formControlLabel: string): string {
    const control = this.registerForm.get(formControlName);

    if (control?.hasError('required')) {
      return `Поле ${capitalizeFirstLetter(
        formControlLabel
      )} обязательно для заполнения`;
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

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.login(this.registerForm.value).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }
}
