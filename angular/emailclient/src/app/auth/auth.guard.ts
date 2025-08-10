import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { map, skipWhile, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanMatchFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.signedin$.pipe(
    // skipWhile: if your stream emits null, wait until it returns true or false
    skipWhile((value) => value === null),
    take(1),
    map((authenticated) => {
      if (!authenticated) {
        router.navigateByUrl('/');
      }
      return true;
    })
  );
};
