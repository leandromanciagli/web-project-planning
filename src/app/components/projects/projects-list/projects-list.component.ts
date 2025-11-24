import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  
  @Output() projectUpdated = new EventEmitter<number>();

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
        this.taskService.getTasksByProject(project.id).subscribe({
          next: (res) => {
            this.tasks = res.data || [];
            this.loadingTasks[project.id] = false;
          },
          error: (error) => {
            console.error('Error obteniendo tareas:', error);
            alert('Error al cargar las tareas del proyecto');
            this.loadingTasks[project.id] = false;
          }
        });
      }
      if (this.authService.hasRole('ONG_COLABORADORA')) {
        this.taskService.getCloudTasksByProject(project.id).subscribe({
          next: (res) => {
            this.tasks = res.data || [];
            this.loadingTasks[project.id] = false;
          },
          error: (error) => {
            console.error('Error obteniendo tareas del cloud:', error);
            alert('Error al cargar las tareas del proyecto');
            this.loadingTasks[project.id] = false;
          }
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
    if (status === 'FINALIZADO') return 'FINALIZADO';
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

    this.commitmentService.createCommitment(commitment).subscribe({
      next: (commitment) => {
        this.loadingCommitment = false;
        this.closeCreateCommitmentModal();
        alert('Solicitud de compromiso creada exitosamente');
      },
      error: (error) => {
        console.error('Error creando compromiso:', error);
        this.loadingCommitment = false;
        alert('Error al crear la solicitud de compromiso. Por favor, intente nuevamente.');
      }
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
    this.loadingCommitment = true;
    
    this.commitmentService.assignCommitment(projectId, this.selectedTask.id, this.selectedCollaborationId).subscribe({
      next: (res) => {
        this.loadingCommitment = false;
        alert('Solicitud de compromiso asignada exitosamente');
        this.closeRequestsForCommitmentModal();
        
        // Refrescar las tareas del proyecto
        this.loadingTasks[projectId] = true;
        this.taskService.getTasksByProject(projectId).subscribe(tasksRes => {
          this.tasks = tasksRes.data || [];
          this.loadingTasks[projectId] = false;
        });

        // Emitir evento al padre para que refresque los proyectos
        this.projectUpdated.emit(projectId);
      },
      error: (error) => {
        console.error('Error asignando compromiso:', error);
        this.loadingCommitment = false;
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
    this.projectService.executeProject(project.id).subscribe({
      next: (res: any) => {
        console.log('Proyecto ejecutado:', res);
        alert('Proyecto ejecutado exitosamente');
        // Emitir evento al padre para que refresque los proyectos
        this.projectUpdated.emit(project.id);
      },
      error: (error) => {
        console.error('Error ejecutando proyecto:', error);
        alert('Error al ejecutar el proyecto. Por favor, intente nuevamente.');
      }
    });
  }

  submitCommitmentDone(task: Task, event?: Event) {
    if (event) { event.stopPropagation(); }
    if (task.isCoverageRequest) {
      this.commitmentService.getCommitmentsByTask(task.id).subscribe({
        next: (commitments) => {
          // Filtrar solo el commitment aprobado
          const allCommitments = commitments || [];
          this.assignedCommitment = allCommitments.find((c: any) => c.status === 'approved');
          
          if (this.assignedCommitment) {
            this.commitmentService.markCommitmentDone(this.assignedCommitment.id).subscribe({
              next: (res) => {
                alert('Compromiso marcado como cumplido exitosamente');

                // Refrescar las tareas del proyecto
                this.loadingTasks[task.projectId] = true;
                this.taskService.getTasksByProject(task.projectId).subscribe(tasksRes => {
                  this.tasks = tasksRes.data || [];
                  this.loadingTasks[task.projectId] = false;
                });

                // Emitir evento al padre para que refresque los proyectos
                this.projectUpdated.emit(task.projectId);
              },
              error: (error) => {
                console.error('Error marcando compromiso como cumplido:', error);
                alert('Error al marcar el compromiso como cumplido. Por favor, intente nuevamente.');
              }
            });
          } else {
            alert('No se encontró un compromiso aprobado para esta tarea');
          }
        },
        error: (error) => {
          console.error('Error obteniendo compromisos:', error);
          alert('Error al marcar el compromiso como cumplido. Por favor, intente nuevamente.');
        }
      });
    }
  }

  finishProject(project: Project) {
    if (this.canCompleteProyect && project.status !== 'COMPLETADO') { return; }
    this.projectService.finishProject(project.id).subscribe({
      next: (res: any) => {
        console.log('Proyecto finalizado:', res);
        alert('Proyecto finalizado exitosamente');
        // Emitir evento al padre para que refresque los proyectos
        this.projectUpdated.emit(project.id);
      },
      error: (error) => {
        console.error('Error finalizando proyecto:', error);
        alert('Error al finalizar el proyecto. Por favor, intente nuevamente.');
      }
    });
  }
}
