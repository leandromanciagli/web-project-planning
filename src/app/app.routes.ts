import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    redirectTo: '/project-form',
    pathMatch: 'full'
  },
  {
    path: 'project-form',
    loadComponent: () => import('./project-form/project-form.component').then(m => m.ProjectFormComponent)
  }
];
