import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  assignedTo: string;
}

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css'
})
export class ProjectsListComponent {
  projects: Project[] = [
    {
      id: 1,
      name: 'Fondo Solidario para Educación Rural',
      description: 'Proyecto colaborativo entre 5 ONGs para financiar la construcción de escuelas y capacitación docente en comunidades rurales de América Latina',
      status: 'En Progreso',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      tasks: [
        { id: 1, title: 'Análisis de Necesidades', description: 'Evaluación de comunidades rurales y identificación de prioridades educativas', status: 'Completado', assignedTo: 'ONG Educación Sin Fronteras' },
        { id: 2, title: 'Recaudación de Fondos', description: 'Campaña de crowdfunding y gestión de donaciones corporativas', status: 'En Progreso', assignedTo: 'Fundación Ayuda Solidaria' },
        { id: 3, title: 'Construcción de Infraestructura', description: 'Edificación de 3 escuelas rurales con tecnología sostenible', status: 'Pendiente', assignedTo: 'Arquitectos Sin Fronteras' },
        { id: 4, title: 'Capacitación Docente', description: 'Programa de formación para maestros en metodologías innovadoras', status: 'Pendiente', assignedTo: 'Instituto de Desarrollo Educativo' }
      ]
    },
    {
      id: 2,
      name: 'Red de Microfinanzas Comunitarias',
      description: 'Iniciativa conjunta para crear una red de microcréditos que impulse el emprendimiento femenino en zonas vulnerables',
      status: 'Planificado',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      tasks: [
        { id: 5, title: 'Estudio de Mercado', description: 'Análisis de necesidades financieras y capacidad de pago en comunidades objetivo', status: 'Pendiente', assignedTo: 'Microfinanzas Solidarias' },
        { id: 6, title: 'Diseño de Productos Financieros', description: 'Creación de productos de microcrédito adaptados a mujeres emprendedoras', status: 'Pendiente', assignedTo: 'Banco de la Mujer' },
        { id: 7, title: 'Capacitación en Gestión Empresarial', description: 'Programa de formación para emprendedoras en administración y ventas', status: 'Pendiente', assignedTo: 'Mujeres Emprendedoras ONG' }
      ]
    },
    {
      id: 3,
      name: 'Programa de Salud Preventiva Comunitaria',
      description: 'Proyecto financiado colaborativamente para implementar clínicas móviles y programas de prevención en áreas de difícil acceso',
      status: 'Completado',
      startDate: '2023-06-01',
      endDate: '2024-01-31',
      tasks: [
        { id: 8, title: 'Adquisición de Equipos Médicos', description: 'Compra de equipos para clínicas móviles y laboratorios portátiles', status: 'Completado', assignedTo: 'Médicos Sin Fronteras' },
        { id: 9, title: 'Capacitación de Personal', description: 'Formación de voluntarios en atención primaria y primeros auxilios', status: 'Completado', assignedTo: 'Cruz Roja Internacional' },
        { id: 10, title: 'Implementación de Clínicas', description: 'Despliegue de 5 clínicas móviles en comunidades rurales', status: 'Completado', assignedTo: 'Salud Comunitaria ONG' },
        { id: 11, title: 'Programa de Vacunación', description: 'Campaña masiva de vacunación infantil y adulta', status: 'Completado', assignedTo: 'UNICEF Local' }
      ]
    },
    {
      id: 4,
      name: 'Iniciativa de Energía Renovable Rural',
      description: 'Proyecto colaborativo para instalar paneles solares y sistemas de energía limpia en comunidades sin acceso a electricidad',
      status: 'En Progreso',
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      tasks: [
        { id: 12, title: 'Evaluación Técnica', description: 'Análisis de viabilidad técnica y diseño de sistemas solares', status: 'Completado', assignedTo: 'Ingenieros Sin Fronteras' },
        { id: 13, title: 'Financiamiento Internacional', description: 'Gestión de fondos con organismos internacionales de desarrollo', status: 'En Progreso', assignedTo: 'Fondo Verde Internacional' },
        { id: 14, title: 'Instalación de Paneles', description: 'Montaje de sistemas solares en 20 comunidades rurales', status: 'Pendiente', assignedTo: 'Energía Limpia ONG' },
        { id: 15, title: 'Capacitación Comunitaria', description: 'Formación de técnicos locales en mantenimiento de sistemas', status: 'Pendiente', assignedTo: 'Desarrollo Rural Sostenible' }
      ]
    }
  ];

  selectedProject: Project | null = null;
  showModal = false;

  openTasksModal(project: Project) {
    this.selectedProject = project;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProject = null;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completado':
        return 'status-completed';
      case 'en progreso':
        return 'status-progress';
      case 'planificado':
        return 'status-planned';
      default:
        return 'status-default';
    }
  }
}
