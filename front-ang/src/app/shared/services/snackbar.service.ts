import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../components';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  private readonly durationInSeconds = 2;
  private readonly horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private readonly verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  private showSnackbar(message: string, type: 'success' | 'error') {
    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: { message, type },
      panelClass: type === 'success' ? 'success' : 'error',
    });
  }

  showSnackbarSuccess(message: string) {
    this.showSnackbar(message, 'success');
  }

  showSnackbarError(message: string) {
    this.showSnackbar(message, 'error');
  }
}
