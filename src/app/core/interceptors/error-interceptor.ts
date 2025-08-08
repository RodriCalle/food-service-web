import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from '@src/app/shared/components/error-snackbar/error-snackbar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      snackBar.openFromComponent(ErrorSnackbarComponent, {
        data: error,
        duration: 4000,
        panelClass: ['error-snackbar'],
      });
      return throwError(() => error);
    })
  );
};
