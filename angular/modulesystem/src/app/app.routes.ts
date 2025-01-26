import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'elements',
    loadChildren: () =>
      import('./elements/elements.module').then((m) => m.ElementsModule),
  },
];
