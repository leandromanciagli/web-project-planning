import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ProjectsListComponent } from '@/components/projects/projects-list/projects-list.component';
import { ProjectService } from '@/services/project.service';

@Component({
  selector: 'app-monitoring',
  imports: [
    CommonModule, 
    ProjectsListComponent,
    FormsModule,
  ],
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.css'
})

export class MonitoringComponent implements OnInit {
  projectsInExecution: any[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.getRunningProjects();
  }

  getRunningProjects(): void {   
    this.projectService.getProjects({ status: ['EN_EJECUCION'] }).subscribe(res => {
      this.projectsInExecution = res.data || [];
    });
  }

  onProjectUpdated(projectId: number): void {
    this.getRunningProjects();
  }
}
