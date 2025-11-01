import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';
import { MypostsComponent } from './components/myposts/myposts.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [loggedGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Signup',
    canActivate: [loggedGuard],
  },
  {
    path: 'timeline',
    component: TimelineComponent,
    title: 'Timeline',
    canActivate: [authGuard],
  },
  {
    path: 'myposts',
    component: MypostsComponent,
    title: 'Myposts',
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: NotfoundComponent,
    title: 'Not Found',
    canActivate: [authGuard],
  },
];
