import { Component, Inject, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrl: './custom-snackbar.component.scss',
})
export class CustomSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { type: 'success' | 'error'; message: string }
  ) {}

  private readonly snackBarRef = inject(MatSnackBarRef);

  close() {
    this.snackBarRef.dismiss();
  }
}
