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
    path: 'files',
    loadComponent: () => import('./features/uploader/uploader').then(m => m.Uploader)
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
