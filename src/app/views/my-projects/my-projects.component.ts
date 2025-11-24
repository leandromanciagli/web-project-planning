import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProjectsListComponent } from '@/components/projects/projects-list/projects-list.component';
import { ProjectService } from '@/services/project.service';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-my-projects',
  imports: [CommonModule, ProjectsListComponent],
  templateUrl: './my-projects.component.html',
  styleUrl: './my-projects.component.css'
})
export class MyProjectsComponent implements OnInit {
  projectsInExecution: any[] = [];
  otherProjects: any[] = [];

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getRunningProjects();
    this.getOtherProjects();
  }

  getRunningProjects(): void {
    const user = this.authService.getUser();
    const userId = user?.id;
    this.projectService.getProjects({ status: ['EN_EJECUCION', 'COMPLETADO'], createdBy: userId }).subscribe(res => {
      this.projectsInExecution = res.data || [];
    });
  }

  getOtherProjects(): void {
    const user = this.authService.getUser();
    const userId = user?.id;
    this.projectService.getProjects({ status: ['GENERADO', 'PLANIFICADO', 'FINALIZADO'], createdBy: userId }).subscribe(res => {
        this.otherProjects = res.data || [];
    });    
  }

  onProjectUpdated(projectId: number): void {
    // Refrescar ambos listados de proyectos cuando se actualiza un proyecto
    this.getRunningProjects();
    this.getOtherProjects();
  }
}
