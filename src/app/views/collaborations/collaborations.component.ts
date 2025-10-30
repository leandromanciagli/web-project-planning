import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsListComponent } from '@/components/projects/projects-list/projects-list.component';
import { ProjectService } from '@/services/project.service';

@Component({
  selector: 'app-collaborations',
  imports: [CommonModule, ProjectsListComponent],
  templateUrl: './collaborations.component.html',
  styleUrl: './collaborations.component.css'
})
export class CollaborationsComponent {
  projectsInExecution: any[] = [];
  otherProjects: any[] = [];

  constructor(private projectService: ProjectService) {}

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
    this.projectService.getProjects(['Generado']).subscribe(res => {
      if ((res as any).success) {
        this.otherProjects = (res as any).data || [];
      }
    });
  }

  
}
