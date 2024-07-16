import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'app/entities/auth';
import { IUser, UserRoleEnum } from 'app/shared/models/auth.model';
import { capitalizeFirstLetter } from 'app/shared/helpers';
import { UserService } from 'app/entities/user';
import { SnackbarService, UploadService } from 'app/shared/services';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.scss',
})
export class ProfileModalComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService,
    private snackBarService: SnackbarService,
    private uploadService: UploadService
  ) {}

  destroy$ = new Subject<void>();

  user: IUser | null = null;
  isAdmin = false;
  isLoading = false;
  isEditMode = false;
  editProfileForm!: FormGroup;

  ngOnInit(): void {
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
      this.isAdmin = user?.roleId === UserRoleEnum.Admin;

      this.editProfileForm = this.fb.group({
        avatarUrl: [user?.avatarUrl || ''],
        fullName: [user?.fullName, [Validators.required]],
        email: [user?.email, [Validators.required]],
      });
    });
  }

  onEditMode(): void {
    this.isEditMode = true;
    this.editProfileForm = this.fb.group({
      avatarUrl: [this.user?.avatarUrl || ''],
      fullName: [this.user?.fullName, [Validators.required]],
      email: [this.user?.email, [Validators.required]],
    });
  }

  offEditMode(): void {
    this.isEditMode = false;
  }

  getErrorMessage(formControlName: string, formControlLabel: string): string {
    const control = this.editProfileForm.get(formControlName);

    if (control?.hasError('required')) {
      return `Поле "${capitalizeFirstLetter(
        formControlLabel
      )}" обязательно для заполнения`;
    }
    return '';
  }

  onUploadInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];

    this.uploadService.uploadImage(file).subscribe((res) => {
      this.editProfileForm.patchValue({ avatarUrl: res.url });
    });
  }

  onSubmit(): void {
    if (this.editProfileForm.valid && this.user) {
      this.isLoading = true;
      this.userService
        .updateUser(this.editProfileForm.value)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => {
          this.authService.setUser(res.data);
          this.snackBarService.showSnackbarSuccess('Профиль успешно обновлен');
          this.offEditMode();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
