import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectsListComponent } from '@/components/projects/projects-list/projects-list.component';
import { ProjectService } from '@/services/project.service';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-collaborations',
  imports: [
    CommonModule,
    ProjectsListComponent,
    FormsModule,
  ],
  templateUrl: './collaborations.component.html',
  styleUrl: './collaborations.component.css'
})
export class CollaborationsComponent implements OnInit {
  projectsInExecution: any[] = [];
  otherProjects: any[] = [];
  finishedProjects: any[] = [];

  constructor(private projectService: ProjectService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getRunningProjects();
    this.getOtherProjects();
    this.getFinishedProjects();
  }

  getRunningProjects(): void {
    // Para colaboraciones, filtrar por collaboratorId (mostrar proyectos en los que colabora)
    this.projectService.getProjectsByCollaboratorId({ status: ['EN_EJECUCION', 'COMPLETADO'], collaboratorId: this.authService.getUser().id }).subscribe(res => {
      this.projectsInExecution = res.data || [];
    });
  }

  getOtherProjects(): void {
    this.projectService.getProjects({ status: ['GENERADO', 'PLANIFICADO'] }).subscribe(res => {
      this.otherProjects = res.data || [];
    });
  }

  getFinishedProjects(): void {
    this.projectService.getProjectsByCollaboratorId({ status: ['FINALIZADO'], collaboratorId: this.authService.getUser().id }).subscribe(res => {
      this.finishedProjects = res.data || [];
    });
  }

  onProjectUpdated(projectId: number): void {
    // Refrescar ambos listados de proyectos cuando se actualiza uno
    this.getRunningProjects();
    this.getOtherProjects();
    this.getFinishedProjects();
  }
}
