import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },
  {
    path: 'vehiculos',
    loadComponent: () => import('./pages/vehiculos-list/vehiculos-list').then(m => m.VehiculosList),
  },
  {
    path: 'vehiculos/:id',
    loadComponent: () => import('./pages/vehiculo-detail/vehiculo-detail').then(m => m.VehiculoDetail),
  },
  {
    path: 'alquileres',
    loadComponent: () => import('./pages/alquileres-list/alquileres-list').then(m => m.AlquileresList),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
  },
  { path: '**', redirectTo: '' },
];
