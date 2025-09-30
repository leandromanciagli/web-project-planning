export interface ProjectStage {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  pedidoCobertura: string;
}

export interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  etapas: ProjectStage[];
  fechaCreacion: string;
}

// API Models
export interface Task {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  estimatedHours: number;
  status: 'todo' | 'in-progress' | 'completed' | 'on-hold';
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  ownerId: number;
  tasks: Task[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
