import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '@/services/task.service';
import { formatDate as formatDateHelper } from '@/helpers/date.helper';
import { AuthService } from '@/services/auth.service';
import { CommitmentService } from '@/services/commitment.service';


interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assignedTo?: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number | null;
  projectId: number;
  takenBy: number | null;
  createdBy: number;
  isCoverageRequest: boolean;
  createdAt: string;
  updatedAt: string;
  taskType: { id: number; title: string };
}


@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css'
})
export class ProjectsListComponent {
  @Input() projects: Project[] = [];
  @Input() title: string = 'Listado de Proyectos';
  @Input() emptyStateMessage: string = 'No hay proyectos disponibles';
  @Input() canCreateProyect: boolean = false;
  @Input() canCollaborate: boolean = false;
  @Input() canViewCollaborations: boolean = false;
  @Input() canExecuteProyect: boolean = false;
  @Input() canCompleteCommitment: boolean = false;

  // Helper function para formatear fechas
  formatDate = formatDateHelper;

  expanded: Record<number, boolean> = {};
  showCommitModal = false;
  selectedTask: Task | null = null;
  commitDescription: string = '';
  selectedProjectName: string = '';
  
  // Colaboraciones
  showCollabModal = false;
  collaborations: any[] = [];
  selectedCollaborationId: number | null = null;

  tasks: Task[] = [];

  constructor(
    private taskService: TaskService, 
    private authService: AuthService, 
    private commitmentService: CommitmentService
  ) {}

  getTasks(project: Project) {
    this.toggleExpand(project);
    if (this.expanded[project.id]) {
      if (this.authService.hasRole('ONG_PRINCIPAL')) {
        this.taskService.getTasksByProject(project.id).subscribe(res => {
          this.tasks = res.data || [];
        });
      }
      if (this.authService.hasRole('ONG_COLABORADORA')) {
        this.taskService.getCloudTasksByProject(project.id).subscribe(res => {
          this.tasks = res.data || [];
        });
      }
    }
  }

  toggleExpand(project: Project) {
    const isOpen = !!this.expanded[project.id];
    // Cerrar todos primero
    this.expanded = {};
    // Si el que clickeamos no estaba abierto, abrirlo
    if (!isOpen) {
      this.expanded[project.id] = true;
      // Scroll suave hacia el proyecto expandido
      setTimeout(() => {
        const el = document.getElementById(`project-row-${project.id}`) || document.getElementById(`project-collapse-${project.id}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    // Proyectos
    if (s === 'generado') return 'status-generated';
    if (s === 'planificado') return 'status-planned';
    if (s === 'en ejecución' || s === 'en ejecucion') return 'status-executing';
    if (s === 'completado') return 'status-completed';

    // Tareas (fallbacks existentes)
    if (s === 'en progreso') return 'status-progress';
    if (s === 'pendiente' || s === 'todo') return 'status-planned';

    return 'status-default';
  }

  openCommitModal(task: Task, project: Project, event?: Event) {
    if (event) { event.stopPropagation(); }
    this.selectedTask = task;
    this.selectedProjectName = project.name;
    this.commitDescription = '';
    this.showCommitModal = true;
  }

  closeCommitModal() {
    this.showCommitModal = false;
    this.selectedTask = null;
    this.commitDescription = '';
    this.selectedProjectName = '';
  }

  openCollabModal(task: Task, project: Project, event?: Event) {
    if (event) { event.stopPropagation(); }
    this.selectedTask = task;
    this.selectedProjectName = project.name;
    this.commitmentService.getCommitmentsByTask(this.selectedTask.id).subscribe(commitments => {
      this.collaborations = commitments || [];
    });
    this.selectedCollaborationId = null;
    this.showCollabModal = true;
  }

  closeCollabModal() {
    this.showCollabModal = false;
    this.selectedTask = null;
    this.selectedProjectName = '';
    this.collaborations = [];
    this.selectedCollaborationId = null;
  }

  submitSelectedCollaboration() {
    if (!this.selectedTask || this.selectedCollaborationId == null) { return; }
    const payload = {
      taskId: this.selectedTask.id,
      collaborationId: this.selectedCollaborationId
    };
    // TODO: Enviar selección de colaboración a la API
    // this.http.post('/api/v1/commitments/select', payload).subscribe(...)
    this.closeCollabModal();  
  }

  submitCommitment() {
    if (!this.selectedTask) { return; }
    const commitment = {
      taskId: this.selectedTask.id,
      ongId: this.authService.getUser()?.id,
      description: this.commitDescription
    };
    
    this.commitmentService.createCommitment(commitment).subscribe(commitment => {
      console.log(commitment);
    });
    this.closeCommitModal();
  }

  markCommitmentCompleted(task: Task, event?: Event) {
    if (event) { event.stopPropagation(); }
    const payload = { taskId: task.id };
    // TODO: Llamar API para marcar compromiso como realizado
    // this.http.post('/api/v1/commitments/complete', payload).subscribe(...)
    console.log('Marcar compromiso como realizado:', payload);
  }

  executeProject(project: Project) {
    if (project.status !== 'Planificado') { return; }
    // TODO: Llamar API para ejecutar proyecto
    // this.http.post(`/api/v1/projects/${project.id}/execute`, {}).subscribe(...)
    console.log('Ejecutar proyecto:', project.id);
  }
}
