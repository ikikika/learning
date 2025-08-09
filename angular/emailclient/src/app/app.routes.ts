import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { EmailIndexComponent } from './inbox/email-index/email-index.component';

export const INBOX_ROUTES: Routes = [
  { path: '', component: EmailIndexComponent },
];

export const routes: Routes = [
  {
    path: 'inbox',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./inbox/email-index/email-index.component').then(
        (c) => c.EmailIndexComponent
      ),
  },
];
