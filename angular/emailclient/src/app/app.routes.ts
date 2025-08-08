import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'inbox',
    loadChildren: () =>
      import('./inbox/inbox.module').then(mod => mod.InboxModule)
  }
];
