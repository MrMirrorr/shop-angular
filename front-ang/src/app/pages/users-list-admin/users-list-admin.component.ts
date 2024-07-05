import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { defer, finalize, Subject, takeUntil, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { UserService } from 'app/entities/user';
import { AuthService } from 'app/entities/auth';
import { IRole, IUser, UserRoleEnum } from 'app/shared/models/auth.model';
import { ControlPanelConfigType } from 'app/shared/models/control-panel.model';
import { SnackbarService } from 'app/shared/services';
import { ConfirmDialogComponent } from 'app/shared/components';

@Component({
  selector: 'app-users-list-admin',
  templateUrl: './users-list-admin.component.html',
  styleUrl: './users-list-admin.component.scss',
})
export class UsersListAdminComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  private destroy$ = new Subject<void>();

  controlPanelConfig: ControlPanelConfigType = {
    enabled: false,
  };

  displayedColumns: string[] = [
    'id',
    'email',
    'fullName',
    'avatar',
    'role',
    'controls',
  ];

  users: IUser[] = [];
  isLoading = false;
  roles: IRole[] = [];
  isRolesLoading = false;
  editedUsers = new Map<IUser['id'], IUser['roleId']>();
  currentUser = this.authService.getUser();

  ngOnInit(): void {
    this.initUsers();

    this.initRoles();

    // Редирект на главную страницу, если пользователь не авторизован или не админ
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (!user || user.roleId !== UserRoleEnum.Admin)
        this.router.navigate(['/']);
    });
  }

  onRoleChange(event: MatSelectChange, user: IUser): void {
    const selectedRoleID = Number(event.value);

    if (selectedRoleID === user.roleId) {
      this.editedUsers.delete(user.id);
    } else {
      this.editedUsers.set(user.id, selectedRoleID);
    }
  }

  roleHasBeenChanged(user: IUser): boolean {
    return this.editedUsers.has(user.id);
  }

  onSaveRole(user: IUser): void {
    const newRoleId = this.editedUsers.get(user.id);

    if (newRoleId === user.roleId) return;
    if (newRoleId === undefined) return;

    this.userService.updateUserRole(user.id, newRoleId).subscribe((res) => {
      if (res.data.id === this.currentUser?.id) {
        this.authService.setUser(res.data);
      }

      this.editedUsers.delete(user.id);

      const updatedUsers = this.users.map((u) => {
        if (u.id === user.id) {
          u = res.data;
        }
        return u;
      });

      this.users = updatedUsers;

      this.snackBarService.showSnackbarSuccess(
        `Роль пользователя ${res.data.fullName} успешно изменена!`
      );
    });
  }

  onDeleteUser(userId: string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Удаление',
        message: 'Вы уверены, что хотите удалить пользователя?',
        onConfirmAction: () => {
          this.isLoading = true;
          this.userService
            .deleteUser(userId)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => {
              this.snackBarService.showSnackbarSuccess(
                'Пользователь успешно добавлен'
              );
              this.initUsers();
            });
        },
      },
    });
  }

  trackById(index: number, item: IRole): string {
    return item.id.toString();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initUsers() {
    defer(() => {
      this.isLoading = true;
      return this.userService.getUsers();
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((users) => {
        this.users = users.data;
      });
  }

  private initRoles() {
    defer(() => {
      this.isRolesLoading = true;
      return this.userService.getRoles();
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isRolesLoading = false))
      )
      .subscribe((roles) => {
        this.roles = roles.data;
      });
  }
}
