import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, EMPTY, of } from 'rxjs';
import { Email } from './email';
import { EmailService } from './email.service';

export const EmailResolverService: ResolveFn<
  Email | ReturnType<Router['createUrlTree']>
> = (route) => {
  const emailService = inject(EmailService);
  const router = inject(Router);
  const id = route.paramMap.get('id')!;

  return emailService.getEmail(id).pipe(
    catchError(() => {
      router.navigateByUrl('/inbox/not-found');

      return EMPTY;
      // Empty is essentially an observable that is already marked as complete.
      // We can return empty any time that we are required to return an observable.
    })
  );
};

// return {
//   id: 'string;',
//   subject: 'string;',
//   text: 'string;',
//   to: 'string;',
//   from: 'string;',
//   html: 'string;',
// };
