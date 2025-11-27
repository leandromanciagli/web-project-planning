import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '@/services/task.service';
import { formatDate as formatDateHelper } from '@/helpers/date.helper';
import { AuthService } from '@/services/auth.service';
import { CommitmentService } from '@/services/commitment.service';
import { ProjectService } from '@/services/project.service';
import { TaskObservationService } from '@/services/task-observation.service';

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
  commitments: any[];
  observations: any[];
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
  @Input() canCompleteLocalTask: boolean = false;
  @Input() canCompleteProyect: boolean = false;
  @Input() canGenerateObservations: boolean = false;
  @Input() canViewObservationsHistory: boolean = false;
  @Input() canResolveObservations: boolean = false;
  @Output() projectUpdated = new EventEmitter<number>();

  // Helper function para formatear fechas
  formatDate = formatDateHelper;

  expanded: Record<number, boolean> = {};
  selectedProjectName: string = '';
  tasks: Task[] = [];
  loadingTasks: Record<number, boolean> = {};
  loadingCompleteCommitment: Record<number, boolean> = {};
  loadingCompleteLocalTask: Record<number, boolean> = {};
  loadingExecuteProject: Record<number, boolean> = {};
  loadingFinishProject: Record<number, boolean> = {};
  selectedTask: any = null;


  // Variables para modal de creación de compromiso
  showCreateCommitmentModal = false;
  loadingCreateCommitmentModal = false;
  commitDescription: string = '';


  // Variables para modal de solicitudes de compromiso
  showRequestsForCommitmentModal = false;
  loadingCollaborations = false;
  collaborations: any[] = [];
  selectedCollaborationId: number | null = null;


  // Variables para modal de compromiso asignado
  showViewAssignedCommitmentModal = false;
  loadingAssignedCommitment = false;
  assignedCommitment: any | null = null;


  // Variables para modal de generación de observaciones
  showModalGenerateObservation: boolean = false;
  loadingGenerateObservation: boolean = false;
  observationDescription: string = '';
  observation: any = null;

  // Variables para modal de historial de observaciones
  showModalViewObservationsHistory: boolean = false;
  loadingViewObservationsHistory: boolean = false;
  taskObservationsHistory: any[] = [];


  // Variables para modal de resolución de observaciones
  showModalResolveObservation: boolean = false;
  loadingResolveObservation: boolean = false;
  resolution: string = '';
  approvedCommitment: any = null;


  constructor(
    private taskService: TaskService, 
    protected authService: AuthService, 
    private commitmentService: CommitmentService,
    private projectService: ProjectService,
    private taskObservationService: TaskObservationService,
  ) {}

  getTasks(projectId: number, toggle: boolean = true) {
    if (toggle) {
      this.toggleExpand(projectId);
    }
    if (this.expanded[projectId]) {
      this.loadingTasks[projectId] = true;
        this.taskService.getTasksByProject(projectId).subscribe({
          next: (res) => {
            this.tasks = res.data || [];
            this.loadingTasks[projectId] = false;
          },
          error: (error) => {
            console.error('Error obteniendo tareas:', error);
            alert('Error al cargar las tareas del proyecto');
            this.loadingTasks[projectId] = false;
          }
        });
    } else {
      this.loadingTasks[projectId] = false;
    }
  }

  toggleExpand(projectId: number) {
    const isOpen = !!this.expanded[projectId];
    // Cerrar todos primero
    this.expanded = {};
    // Si el que clickeamos no estaba abierto, abrirlo
    if (!isOpen) {
      this.expanded[projectId] = true;
      // Scroll suave hacia el proyecto expandido
      setTimeout(() => {
        const el = document.getElementById(`project-row-${projectId}`) || document.getElementById(`project-collapse-${projectId}`);
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
    if (status === 'FINALIZADO') return 'FINALIZADO';
    return '';
  }

  getTaskStatusName(status: string, takenBy: number | null): string {

    if (status === 'todo' && takenBy === null) return 'PENDIENTE DE ASIGNACIÓN';
    if (status === 'todo' && takenBy !== null) return 'ASIGNADA';
    if (status === 'in_progress') return 'EN PROGRESO';
    if (status === 'done') return 'COMPLETADA';

    return '';
  }

  getCommitmentStatusName(status: string): string {

    if (status === 'pending') return 'COMPROMISO PENDIENTE DE APROBACIÓN';
    if (status === 'approved') return 'COMPROMISO APROBADO';
    if (status === 'rejected') return 'COMPROMISO RECHAZADO';
    if (status === 'done') return 'COMPROMISO COMPLETADO';

    return '';
  }

  hasCommitment(task: Task): any {
    if (!task.isCoverageRequest) { return false; }
    const commitment = task.commitments.find((commitment: any) => commitment.ongId == this.authService.getUser().id);
    return commitment ? this.getCommitmentStatusName(commitment.status) : '';
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
    this.loadingCreateCommitmentModal = true;
    const projectId = this.selectedTask.projectId;
    const commitment = {
      taskId: this.selectedTask.id,
      ongId: this.authService.getUser()?.id,
      description: this.commitDescription
    };

    this.commitmentService.createCommitment(commitment).subscribe({
      next: (commitment) => {
        this.loadingCreateCommitmentModal = false;
        this.closeCreateCommitmentModal();
        alert('Solicitud de compromiso creada exitosamente');

        // Refrescar las tareas del proyecto
        this.getTasks(projectId, false);
      },
      error: (error) => {
        console.error('Error creando compromiso:', error);
        this.loadingCreateCommitmentModal = false;
        alert('Error al crear la solicitud de compromiso. Por favor, intente nuevamente.');
      }
    });
  }

  closeCreateCommitmentModal() {
    this.showCreateCommitmentModal = false;
    this.selectedTask = null;
    this.commitDescription = '';
    this.selectedProjectName = '';
    this.loadingCreateCommitmentModal = false;
  }

  openRequestsForCommitmentModal(task: Task, project: Project, event?: Event) {
    if (event) { event.stopPropagation(); }
    this.selectedTask = task;
    this.selectedProjectName = project.name;
    this.selectedCollaborationId = null;
    this.showRequestsForCommitmentModal = true;
    this.loadingCollaborations = true;
    this.commitmentService.getCommitmentsByTask(this.selectedTask.id).subscribe({
      next: (commitments) => {
        this.collaborations = commitments || [];
        this.loadingCollaborations = false;
      },
      error: (error) => {
        console.error('Error obteniendo compromisos:', error);
        alert('Error al cargar las solicitudes de compromiso');
        this.loadingCollaborations = false;
      }
    });
  }

  submitAssignedCommitment() {
    if (!this.selectedTask || this.selectedCollaborationId == null) { return; }
    const projectId = this.selectedTask.projectId;
    this.loadingCreateCommitmentModal = true;
    this.commitmentService.assignCommitment(projectId, this.selectedTask.id, this.selectedCollaborationId).subscribe({
      next: (res) => {
        this.loadingCreateCommitmentModal = false;
        this.closeRequestsForCommitmentModal();
        alert('Solicitud de compromiso asignada exitosamente');

        // Refrescar las tareas del proyecto
        this.getTasks(projectId, false);

        // Emitir evento al padre para que refresque los proyectos
        this.projectUpdated.emit(projectId);
      },
      error: (error) => {
        console.error('Error asignando compromiso:', error);
        this.loadingCreateCommitmentModal = false;
        alert('Error al asignar la solicitud de compromiso. Por favor, intente nuevamente.');
      }
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
    this.commitmentService.getCommitmentsByTask(this.selectedTask.id).subscribe({
      next: (commitments) => {
        // Filtrar solo el commitment aprobado o completado
        const allCommitments = commitments || [];
        this.assignedCommitment = allCommitments.find((c: any) => (c.status === 'approved' || c.status === 'done'));
        this.loadingAssignedCommitment = false;
      },
      error: (error) => {
        console.error('Error obteniendo compromiso asignado:', error);
        alert('Error al cargar el compromiso asignado');
        this.loadingAssignedCommitment = false;
      }
    });
  }

  closeViewAssignedCommitmentModal() {
    this.showViewAssignedCommitmentModal = false;
    this.selectedTask = null;
    this.selectedProjectName = '';
  }

  executeProject(project: Project) {
    if (this.canExecuteProyect && project.status !== 'PLANIFICADO') { return; }
    
    // Confirmar antes de ejecutar el proyecto
    const confirmMessage = `¿Está seguro de que desea ejecutar el proyecto "${project.name}"?`;
    if (!confirm(confirmMessage)) {
      return;
    }
    
    this.loadingExecuteProject[project.id] = true;
    this.projectService.executeProject(project.id).subscribe({
      next: (res: any) => {
        this.loadingExecuteProject[project.id] = false;
        console.log('Proyecto ejecutado:', res);
        alert('Proyecto ejecutado exitosamente');
        // Emitir evento al padre para que refresque los proyectos
        this.projectUpdated.emit(project.id);
      },
      error: (error) => {
        this.loadingExecuteProject[project.id] = false;
        console.error('Error ejecutando proyecto:', error);
        alert('Error al ejecutar el proyecto. Por favor, intente nuevamente.');
      }
    });
  }

  submitLocalTaskDone(task: Task, event?: Event) {
    if (event) { event.stopPropagation(); }
    const projectId = task.projectId;
    if (!task.isCoverageRequest) {
      this.loadingCompleteLocalTask[task.id] = true;
      this.taskService.markLocalTaskAsDone(task.id).subscribe({
        next: (res) => {
          this.loadingCompleteLocalTask[task.id] = false;
          alert('Tarea marcada como cumplida exitosamente');

          // Refrescar las tareas del proyecto
          this.getTasks(projectId, false);

          // Emitir evento al padre para que refresque los proyectos
          this.projectUpdated.emit(projectId);
        },
        error: (error) => {
          console.error('Error marcando tarea como cumplida:', error);
          this.loadingCompleteLocalTask[task.id] = false;
          alert('Error al marcar la tarea como cumplida. Por favor, intente nuevamente.');
        }
      });
    }
  }

  submitCommitmentDone(task: Task, event?: Event) {    
    if (event) { event.stopPropagation(); }
    const projectId = task.projectId;
    if (task.isCoverageRequest) {
      this.loadingCompleteCommitment[task.id] = true;
      this.commitmentService.markCommitmentDone(this.getApprovedCommitment(task).id).subscribe({
        next: (res) => {
          this.loadingCompleteCommitment[task.id] = false;
          alert('Compromiso marcado como cumplido exitosamente');

          // Refrescar las tareas del proyecto
          this.getTasks(projectId, false);

          // Emitir evento al padre para que refresque los proyectos
          this.projectUpdated.emit(projectId);
        },
        error: (error) => {
          console.error('Error marcando compromiso como cumplido:', error);
          this.loadingCompleteCommitment[task.id] = false;
          alert('Error al marcar el compromiso como cumplido. Por favor, intente nuevamente.');
        }
      });
    }
  }

  finishProject(project: Project) {
    if (this.canCompleteProyect && project.status !== 'COMPLETADO') { return; }

    // Confirmar antes de finalizar el proyecto
    const confirmMessage = `¿Estás seguro de finalizar el proyecto "${project.name}"?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    this.loadingFinishProject[project.id] = true;
    this.projectService.finishProject(project.id).subscribe({
      next: (res: any) => {
        this.loadingFinishProject[project.id] = false;
        console.log('Proyecto finalizado:', res);
        alert('Proyecto finalizado exitosamente');
        // Emitir evento al padre para que refresque los proyectos
        this.projectUpdated.emit(project.id);
      },
      error: (error) => {
        this.loadingFinishProject[project.id] = false;
        console.error('Error finalizando proyecto:', error);
        alert('Error al finalizar el proyecto. Por favor, intente nuevamente.');
      }
    });
  }

  openModalGenerateObservation(task: any): void {
    this.selectedTask = task;
    this.approvedCommitment = this.getApprovedCommitment(task);
    this.showModalGenerateObservation = true;
  }

  submitGenerateObservation(): void {
    this.loadingGenerateObservation = true;
    const projectId = this.selectedTask.projectId;
    this.taskObservationService.createTaskObservation({ taskId: this.selectedTask.id, observation: this.observationDescription, userId: this.authService.getUser().id }).subscribe(res => {
      this.loadingGenerateObservation = false;
      this.closeModalGenerateObservation();
      alert('Observación generada exitosamente');

      // Refrescar las tareas del proyecto
      this.getTasks(projectId, false);

    });
  }

  openModalViewObservationsHistory(task: any): void {
    this.loadingViewObservationsHistory = true;
    this.showModalViewObservationsHistory = true;
    this.taskObservationsHistory = [];
    this.taskObservationService.getTaskObservations(task.id).subscribe({
      next: (res) => {
        this.taskObservationsHistory = res || [];
        this.taskObservationsHistory.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA; // Orden descendente (más reciente primero)
        });
        this.loadingViewObservationsHistory = false;
      },
      error: (err) => {
        console.error('Error al cargar el historial de observaciones:', err);
        this.taskObservationsHistory = [];
        this.loadingViewObservationsHistory = false;
      }
    });
  }

  closeModalGenerateObservation(): void {
    this.showModalGenerateObservation = false;
    this.selectedTask = null;
    this.approvedCommitment = null;
    this.observationDescription = '';
    this.loadingGenerateObservation = false;
  }

  closeModalViewObservationsHistory(): void {
    this.showModalViewObservationsHistory = false;
    this.taskObservationsHistory = [];
    this.approvedCommitment = null;
  }

  getApprovedCommitment(task: Task): any {
    return task.commitments.find((commitment: any) => commitment.status === 'approved');
  }

  getObservationWithoutResolution(task: Task): any {
    if (!task.isCoverageRequest) { return null; }
    return task.observations.find((observation: any) => observation.resolution === null);
  }

  openModalResolveObservation(task: any): void {
    this.selectedTask = task;
    this.approvedCommitment = this.getApprovedCommitment(task);
    this.observation = this.getObservationWithoutResolution(task);
    this.showModalResolveObservation = true;
  }

  closeModalResolveObservation(): void {
    this.showModalResolveObservation = false;
    this.selectedTask = null;
    this.approvedCommitment = null;
    this.observation = null;
    this.resolution = '';
  }

  submitResolveObservation(observation: any): void {
    console.log('observation', observation);
    this.loadingResolveObservation = true;
    const projectId = this.selectedTask.projectId;
    this.taskObservationService.resolveTaskObservation(observation.id, this.resolution, this.authService.getUser().id, observation.bonitaCaseId).subscribe({
      next: (res: any) => {
        this.loadingResolveObservation = false;
        this.closeModalResolveObservation();
        alert('Observación resuelta exitosamente');
        
        // Refrescar las tareas del proyecto
        this.getTasks(projectId, false);

      },
      error: (error: any) => {
        console.error(error);
        this.loadingResolveObservation = false;
        alert('Error al resolver la observación. Por favor, intente nuevamente.');
      }
    });
  }
}
