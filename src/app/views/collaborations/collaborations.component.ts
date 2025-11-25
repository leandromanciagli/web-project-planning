import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectsListComponent } from '@/components/projects/projects-list/projects-list.component';
import { ProjectService } from '@/services/project.service';

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

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.getRunningProjects();
    this.getOtherProjects();
  }

  getRunningProjects(): void {
    // Para colaboraciones, no filtrar por ownerId (mostrar proyectos en los que colabora)
    this.projectService.getProjects({ status: ['EN_EJECUCION'] }).subscribe(res => {
      this.projectsInExecution = res.data || [];
    });
  }

  getOtherProjects(): void {
    // Para colaboraciones, no filtrar por ownerId (mostrar proyectos en los que colabora)
    this.projectService.getProjects({ status: ['GENERADO'] }).subscribe(res => {
      this.otherProjects = res.data || [];
    });
  }

  onProjectUpdated(projectId: number): void {
    // Refrescar ambos listados de proyectos cuando se actualiza uno
    this.getRunningProjects();
    this.getOtherProjects();
  }
}
