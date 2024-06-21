import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAuthModalData } from 'app/shared/models/auth-modal.model';
import { AuthService } from 'app/entities/auth/auth.service';
import { capitalizeFirstLetter } from 'app/shared/helpers';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss',
})
export class AuthModalComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AuthModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAuthModalData,
    private authService: AuthService
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isLoading!: boolean;
  authForm!: FormGroup;

  ngOnInit(): void {
    this.authService.isAuthLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  getErrorMessage(formControlName: string, formControlLabel: string): string {
    const control = this.authForm.get(formControlName);

    if (control?.hasError('required')) {
      return `Поле ${capitalizeFirstLetter(
        formControlLabel
      )} обязательно для заполнения`;
    } else if (control?.hasError('email')) {
      return 'Неверный формат email';
    } else if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Минимальная длина пароля - ${minLength} символов`;
    }

    return '';
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      this.authService.login(this.authForm.value).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }
}
