import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'my-account',
    loadComponent: () => import('./features/my-account/my-account').then(m => m.MyAccount)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
