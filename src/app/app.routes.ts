import { Routes } from '@angular/router';

export const routes: Routes = [
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
