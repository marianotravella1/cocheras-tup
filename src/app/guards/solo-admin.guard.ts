import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router  } from '@angular/router';
import { DataAuthService } from '../services/data-auth.service';

export const soloAdminGuard: CanActivateFn = (route, state) => {
  const dataAuthService = inject(DataAuthService);
  const router = inject(Router);

  if (dataAuthService.usuario?.isAdmin) {
    console.log("es admin")
    return true;
  }
  const url = router.parseUrl('/parking-state');
  return new RedirectCommand(url);
};