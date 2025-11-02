import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'Login',
    canActivate: [loggedGuard],
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    title: 'Signup',
    canActivate: [loggedGuard],
  },

  {
    path: 'timeline',
    loadComponent: () =>
      import('./components/timeline/timeline.component').then(
        (m) => m.TimelineComponent
      ),
    title: 'Timeline',
    canActivate: [authGuard],
  },

  {
    path: 'myposts',
    loadComponent: () =>
      import('./components/myposts/myposts.component').then(
        (m) => m.MypostsComponent
      ),
    title: 'My Posts',
    canActivate: [authGuard],
  },

  {
    path: '**',
    loadComponent: () =>
      import('./components/notfound/notfound.component').then(
        (m) => m.NotfoundComponent
      ),
    title: 'Not Found',
    canActivate: [authGuard],
  },
];
