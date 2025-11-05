import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '@/guards/login.guard';
import { NoAuthGuard } from '@/guards/no-auth.guard';
import { FirstSectionGuard } from '@/guards/first-section.guard';
import { RegisterComponent } from '@/components/auth/register/register.component';
import { LoginComponent } from '@/components/auth/login/login.component';
import { HomeComponent } from '@/components/app/home/home.component';
import { ProjectFormComponent } from '@/components/projects/project-form/project-form.component';
import { MyProjectsComponent } from '@/views/my-projects/my-projects.component';
import { CollaborationsComponent } from '@/views/collaborations/collaborations.component';
import { MonitoringComponent } from '@/views/monitoring/monitoring.component';

export const routes: Routes = [
  
  // Rutas públicas (solo accesibles si NO hay sesión)
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  
  // Rutas protegidas (requieren autenticación)
  {
    path: 'app',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', canActivate: [FirstSectionGuard], children: [] },
      { path: 'my-projects', component: MyProjectsComponent },
      { path: 'collaborations', component: CollaborationsComponent },
      { path: 'monitoring', component: MonitoringComponent },
      { path: 'my-projects/create-project', component: ProjectFormComponent }
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