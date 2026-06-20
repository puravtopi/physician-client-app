import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/layout/main-layout/main-layout')
        .then(m => m.MainLayout),

    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component')
            .then(m => m.HomeComponent)
      },
      {
        path: 'physicians',
        loadComponent: () =>
          import('./pages/physcio-list/physcio-list')
            .then(m => m.PhyscioList)
      },
      {
        path: 'physicians/:id',
        loadComponent: () =>
          import('./pages/physician-detail/physician-detail')
            .then(m => m.PhysicianDetail)
      }]
  }
];
