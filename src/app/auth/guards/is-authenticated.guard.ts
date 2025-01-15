import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  debugger;

  const authService = inject( AuthService );
  const router = inject( Router );

  if ( (authService.authStatus() === AuthStatus.authenticated) || (authService.authStatus() === AuthStatus.checking) ) {
    return true;
  }

  authService.logout().subscribe({
    next: () => router.navigateByUrl('/auth/login'),
  });
  return false;
};
