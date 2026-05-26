import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const cloned = req.clone({ withCredentials: true });
  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && req.url.includes('/dashboard/') && !req.url.endsWith('/auth/login')) {
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
