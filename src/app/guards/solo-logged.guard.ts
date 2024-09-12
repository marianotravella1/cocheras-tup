import { CanActivateFn } from '@angular/router';

export const soloLoggedGuard: CanActivateFn = (route, state) => {
  return true;
};
