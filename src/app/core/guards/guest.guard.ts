import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const guestGuard = () => {
  const router = inject(Router);

  if (!localStorage.getItem('token')) {
    return true;
  }

  router.navigate(['/tasks']);
  return false;
};
