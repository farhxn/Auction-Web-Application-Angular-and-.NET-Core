import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authGuard = inject(AuthServiceService);
  const router = inject(Router);

  if (authGuard.isLoggedIn()) {
    const claimReq = route.data['claimReq'] as Function;

    if (claimReq) {
      const claims = authGuard.getClaims();
      if (!claimReq(claims)) {
        router.navigateByUrl('/404');
        return false;
      }
    }
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
