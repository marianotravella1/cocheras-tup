import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router  } from '@angular/router';
import { DataAuthService } from '../services/data-auth.service';

export const soloAdminGuard: CanActivateFn = (route, state) => {
  const dataAuthService = inject(DataAuthService);
  const router = inject(Router)

  return true;
};