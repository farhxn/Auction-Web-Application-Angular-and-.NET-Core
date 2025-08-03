import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';
import { tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServiceService);
  const route = inject(Router);
  const toast = inject(ToastrService);

  if (authService.isLoggedIn()) {
    const clonedReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + authService.getToken()
      ),
    });
    return next(clonedReq).pipe(
      tap({
        error: (err: any) => {
          if (err.status == 401) {
            authService.deleteToken();
            route.navigateByUrl('/login');
            setTimeout(() => {
              toast.info('Please login Again');
            }, 1500);
          } else if (err.status == 403) {
            toast.error(
              "Ooops!! It seems you're not authorized to perform action"
            );
          }
        },
      })
    );
  } else return next(req);
};
