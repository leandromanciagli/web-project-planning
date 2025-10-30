import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '@/guards/login.guard';
import { RegisterComponent } from '@/components/auth/register/register.component';
import { LoginComponent } from '@/components/auth/login/login.component';
import { HomeComponent } from '@/components/app/home/home.component';
import { ProjectFormComponent } from '@/components/projects/project-form/project-form.component';
import { ProjectsListComponent } from '@/components/projects/projects-list/projects-list.component';

export const routes: Routes = [
  
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Rutas protegidas (requieren autenticación)
  {
    path: 'app',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'projects', component: ProjectsListComponent },
      { path: 'create-project', component: ProjectFormComponent }
    ]
  },
  
  // Redirecciones
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }  