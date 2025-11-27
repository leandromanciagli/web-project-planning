import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsListComponent } from '@/components/projects/projects-list/projects-list.component';
import { ProjectService } from '@/services/project.service';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-monitoring',
  imports: [
    CommonModule,
    ProjectsListComponent,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.css'
})

export class MonitoringComponent implements OnInit {
  projectsInExecution: any[] = [];
  finishedProjects: any[] = [];
  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getRunningProjects();
    this.getFinishedProjects();
  }

  isGerencialUser(): boolean {
    return this.authService.hasRole('ONG_GERENCIAL');
  }

  getRunningProjects(): void {
    this.projectService.getProjects({ status: ['EN_EJECUCION', 'COMPLETADO'] }).subscribe(res => {
      this.projectsInExecution = res.data || [];
    });
  }

  getFinishedProjects(): void {
    this.projectService.getProjects({ status: ['FINALIZADO'] }).subscribe(res => {
      this.finishedProjects = res.data || [];
    });
  }

  onProjectUpdated(projectId: number): void {
    this.getRunningProjects();
  }

  refreshData(): void {
    this.getRunningProjects();
  }
}
