import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (localStorage.getItem('token')) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
