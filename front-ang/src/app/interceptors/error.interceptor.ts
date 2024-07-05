import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from 'app/shared/services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackbarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Неизвестная ошибка';
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.error) {
          if (error.error.msg) errorMessage = error.error.msg;
          if (error.error.error) errorMessage = error.error.error;
        } else {
          errorMessage = `Server-side error: ${error.status} ${error.message}`;
        }
      }
      console.error(errorMessage);
      snackbarService.showSnackbarError(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
