import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: 'elements',
    // lazy loading
    loadChildren: () =>
      import('./elements/elements.module').then((m) => m.ElementsModule),
  },
  {
    path: 'collections',
    loadChildren: () =>
      import('./collections/collections.module').then((m) => m.CollectionsModule),
  },
  {
    path: 'views',
    loadChildren: () =>
      import('./views/views.module').then((m) => m.ViewsModule),
  },
  {
    path: '', component: HomeComponent
  },
  {
    // catch all route
    // needs to be at the end
    path: '**', component: NotFoundComponent
  },
];
