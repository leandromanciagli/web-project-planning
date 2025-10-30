import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProjectsListComponent } from '@/components/projects/projects-list/projects-list.component';
import { ProjectService } from '@/services/project.service';

@Component({
  selector: 'app-my-projects',
  imports: [CommonModule, ProjectsListComponent],
  templateUrl: './my-projects.component.html',
  styleUrl: './my-projects.component.css'
})
export class MyProjectsComponent implements OnInit {
  projectsInExecution: any[] = [];
  otherProjects: any[] = [];

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.getRunningProjects();
    this.getOtherProjects();
  }

  getRunningProjects(): void {
    this.projectService.getProjects(['En Ejecución']).subscribe(res => {
      if ((res as any).success) {
        this.projectsInExecution = (res as any).data || [];
      }
    });
  }

  getOtherProjects(): void {
    this.projectService.getProjects(['Generado', 'Planificado', 'Completado']).subscribe(res => {
      if ((res as any).success) {
        this.otherProjects = (res as any).data || [];
      }
    });
  }
}
