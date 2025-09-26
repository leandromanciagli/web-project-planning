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
