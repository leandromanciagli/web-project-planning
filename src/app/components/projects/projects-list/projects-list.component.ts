import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '@/services/task.service';
import { formatDate as formatDateHelper } from '@/helpers/date.helper';
import { AuthService } from '@/services/auth.service';
import { CommitmentService } from '@/services/commitment.service';
import { ProjectService } from '@/services/project.service';

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
  dueDate: string;
  estimatedHours: number;
  actualHours: number | null;
  projectId: number;
  takenBy: number | null;
  takenByUser?: any;
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
  @Input() tableTitle: string = 'Listado de Proyectos';
  @Input() emptyStateMessage: string = 'No hay proyectos disponibles';
  @Input() canCreateProyect: boolean = false;
  @Input() canCollaborate: boolean = false;
  @Input() canViewCollaborations: boolean = false;
  @Input() canExecuteProyect: boolean = false;
  @Input() canCompleteCommitment: boolean = false;
  @Input() canCompleteProyect: boolean = false;

  // Helper function para formatear fechas
  formatDate = formatDateHelper;

  expanded: Record<number, boolean> = {};
  showCreateCommitmentModal = false;
  selectedTask: Task | null = null;
  commitDescription: string = '';
  selectedProjectName: string = '';
  
  // Solicitudes de compromiso
  showRequestsForCommitmentModal = false;
  collaborations: any[] = [];
  selectedCollaborationId: number | null = null;

  showViewAssignedCommitmentModal = false;
  assignedCommitment: any | null = null;
  loadingAssignedCommitment = false;

  tasks: Task[] = [];
  loadingTasks: Record<number, boolean> = {};
  loadingCollaborations = false;
  loadingCommitment = false;

  constructor(
    private taskService: TaskService, 
    private authService: AuthService, 
    private commitmentService: CommitmentService,
    private projectService: ProjectService
  ) {}

  getTasks(project: Project) {
    this.toggleExpand(project);
    if (this.expanded[project.id]) {
      this.loadingTasks[project.id] = true;
      if (this.authService.hasRole('ONG_PRINCIPAL')) {
        this.taskService.getTasksByProject(project.id).subscribe(res => {
          this.tasks = res.data || [];
          this.loadingTasks[project.id] = false;
        });
      }
      if (this.authService.hasRole('ONG_COLABORADORA')) {
        this.taskService.getCloudTasksByProject(project.id).subscribe(res => {
          this.tasks = res.data || [];
          this.loadingTasks[project.id] = false;
        });
      }
    } else {
      this.loadingTasks[project.id] = false;
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

  getProjectStatusName(status: string): string {
    if (status === 'GENERADO') return 'GENERADO';
    if (status === 'PLANIFICADO') return 'PLANIFICADO';
    if (status === 'EN_EJECUCION') return 'EN EJECUCIÓN';
    if (status === 'COMPLETADO') return 'COMPLETADO';
    return '';
  }

  getStatusName(status: string, takenBy: number | null): string {

    if (status === 'todo' && takenBy === null) return 'Pendiente de asignación';
    if (status === 'todo' && takenBy !== null) return 'Asignada';
    if (status === 'in_progress') return 'En progreso';
    if (status === 'done') return 'Completada';

    return '';
  }

  openCreateCommitmentModal(task: Task, project: Project, event?: Event) {
    if (event) { event.stopPropagation(); }
    this.selectedTask = task;
    this.selectedProjectName = project.name;
    this.commitDescription = '';
    this.showCreateCommitmentModal = true;
  }

  submitCreateCommitment() {
    if (!this.selectedTask || !this.commitDescription.trim()) { return; }
    this.loadingCommitment = true;
    const commitment = {
      taskId: this.selectedTask.id,
      ongId: this.authService.getUser()?.id,
      description: this.commitDescription
    };

    this.commitmentService.createCommitment(commitment).subscribe(commitment => {
      this.loadingCommitment = false;
      this.closeCreateCommitmentModal();
      alert('Solicitud de compromiso creada exitosamente');
    });
  }

  closeCreateCommitmentModal() {
    this.showCreateCommitmentModal = false;
    this.selectedTask = null;
    this.commitDescription = '';
    this.selectedProjectName = '';
    this.loadingCommitment = false;
  }

  openRequestsForCommitmentModal(task: Task, project: Project, event?: Event) {
    if (event) { event.stopPropagation(); }
    this.selectedTask = task;
    this.selectedProjectName = project.name;
    this.selectedCollaborationId = null;
    this.showRequestsForCommitmentModal = true;
    this.loadingCollaborations = true;
    this.commitmentService.getCommitmentsByTask(this.selectedTask.id).subscribe(commitments => {
      this.collaborations = commitments || [];
      this.loadingCollaborations = false;
    });
  }

  submitAssignedCommitment() {
    if (!this.selectedTask || this.selectedCollaborationId == null) { return; }
    const projectId = this.selectedTask.projectId;
    this.loadingCommitment = true;
    
    this.commitmentService.assignCommitment(projectId, this.selectedTask.id, this.selectedCollaborationId).subscribe(res => {
      this.loadingCommitment = false;
      alert('Solicitud de compromiso asignada exitosamente');
      this.closeRequestsForCommitmentModal();
      
      // Refrescar las tareas después de asignar el compromiso
      this.loadingTasks[projectId] = true;
      this.taskService.getTasksByProject(projectId).subscribe(tasksRes => {
        this.tasks = tasksRes.data || [];
        this.loadingTasks[projectId] = false;
      });
    });
  }

  closeRequestsForCommitmentModal() {
    this.showRequestsForCommitmentModal = false;
    this.selectedTask = null;
    this.selectedProjectName = '';
    this.collaborations = [];
    this.selectedCollaborationId = null;
    this.loadingCollaborations = false;
  }

  openViewAssignedCommitmentModal(task: Task, project: Project, event?: Event) {
    if (event) { event.stopPropagation(); }
    this.selectedTask = task;
    this.selectedProjectName = project.name;
    this.selectedCollaborationId = null;
    this.showViewAssignedCommitmentModal = true;
    this.loadingAssignedCommitment = true;
    this.commitmentService.getCommitmentsByTask(this.selectedTask.id).subscribe(commitments => {
      // Filtrar solo el commitment aprobado o completado
      const allCommitments = commitments || [];
      this.assignedCommitment = allCommitments.find((c: any) => (c.status === 'approved' || c.status === 'done'));
      this.loadingAssignedCommitment = false;
    });
  }

  closeViewAssignedCommitmentModal() {
    this.showViewAssignedCommitmentModal = false;
    this.selectedTask = null;
    this.selectedProjectName = '';
  }

  executeProject(project: Project) {
    if (this.canExecuteProyect && project.status !== 'PLANIFICADO') { return; }
    this.projectService.executeProject(project.id).subscribe((res: any) => {
      console.log('Proyecto ejecutado:', res);
      alert('Proyecto ejecutado exitosamente');
    });
  }

  submitCommitmentDone(task: Task, event?: Event) {
    if (event) { event.stopPropagation(); }
    this.selectedTask = task;
    if (this.selectedTask.isCoverageRequest) {
      this.commitmentService.getCommitmentsByTask(this.selectedTask.id).subscribe(commitments => {
        // Filtrar solo el commitment aprobado
        const allCommitments = commitments || [];
        this.assignedCommitment = allCommitments.find((c: any) => c.status === 'approved');
      });
      this.commitmentService.markCommitmentDone(this.assignedCommitment.id).subscribe(res => {
        alert('Compromiso marcado como cumplido exitosamente');
      });
    }
  }

  completeProject(project: Project) {
    if (this.canCompleteProyect && project.status !== 'EN_EJECUCION') { return; }
    this.projectService.completeProject(project.id).subscribe((res: any) => {
      console.log('Proyecto completado:', res);
      alert('Proyecto completado exitosamente');
    });
  }
}
