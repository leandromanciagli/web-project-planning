import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { CreateProjectRequest, ApiResponse } from '@/models/ProjectTask';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = 'http://localhost:5001/api/v1/projects';
  
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }


  getProjects(statuses?: string[]): Observable<ApiResponse<any[]>> {
    const projects = [
      {
        id: 1,
        name: 'Fondo Solidario para Educación Rural',
        description: 'Proyecto colaborativo entre 5 ONGs para financiar la construcción de escuelas y capacitación docente en comunidades rurales de América Latina',
        status: 'Generado',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        tasks: [
          { id: 1, title: 'Análisis de Necesidades', description: 'Evaluación de comunidades rurales y identificación de prioridades educativas', status: 'todo', assignedTo: 'ONG Educación Sin Fronteras', dueDate: '2024-05-15T23:59:59Z', estimatedHours: 16, actualHours: 16, projectId: 1, takenBy: 2, createdBy: 1, isCoverageRequest: false, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-16T10:00:00Z', taskType: { id: 1, title: 'Relevamiento' } },
          { id: 2, title: 'Recaudación de Fondos', description: 'Campaña de crowdfunding y gestión de donaciones corporativas', status: 'en progreso', assignedTo: 'Fundación Ayuda Solidaria', dueDate: '2024-08-31T23:59:59Z', estimatedHours: 40, actualHours: null, projectId: 1, takenBy: 3, createdBy: 1, isCoverageRequest: true, createdAt: '2024-03-01T09:30:00Z', updatedAt: '2024-04-10T11:45:00Z', taskType: { id: 2, title: 'Financiamiento' } },
          { id: 3, title: 'Construcción de Infraestructura', description: 'Edificación de 3 escuelas rurales con tecnología sostenible', status: 'pendiente', assignedTo: 'Arquitectos Sin Fronteras', dueDate: '2024-12-31T23:59:59Z', estimatedHours: 120, actualHours: null, projectId: 1, takenBy: null, createdBy: 1, isCoverageRequest: false, createdAt: '2024-02-10T12:00:00Z', updatedAt: '2024-02-10T12:00:00Z', taskType: { id: 3, title: 'Construcción' } },
          { id: 4, title: 'Capacitación Docente', description: 'Programa de formación para maestros en metodologías innovadoras', status: 'pendiente', assignedTo: 'Instituto de Desarrollo Educativo', dueDate: '2024-11-15T23:59:59Z', estimatedHours: 60, actualHours: null, projectId: 1, takenBy: null, createdBy: 1, isCoverageRequest: false, createdAt: '2024-02-20T08:20:00Z', updatedAt: '2024-02-20T08:20:00Z', taskType: { id: 4, title: 'Capacitación' } }
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
          { id: 5, title: 'Estudio de Mercado', description: 'Análisis de necesidades financieras y capacidad de pago en comunidades objetivo', status: 'pendiente', assignedTo: 'Microfinanzas Solidarias', dueDate: '2024-04-30T23:59:59Z', estimatedHours: 24, actualHours: null, projectId: 2, takenBy: null, createdBy: 1, isCoverageRequest: false, createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z', taskType: { id: 5, title: 'Análisis' } },
          { id: 6, title: 'Diseño de Productos Financieros', description: 'Creación de productos de microcrédito adaptados a mujeres emprendedoras', status: 'pendiente', assignedTo: 'Banco de la Mujer', dueDate: '2024-06-15T23:59:59Z', estimatedHours: 32, actualHours: null, projectId: 2, takenBy: null, createdBy: 1, isCoverageRequest: false, createdAt: '2024-02-10T11:00:00Z', updatedAt: '2024-02-10T11:00:00Z', taskType: { id: 6, title: 'Diseño' } },
          { id: 7, title: 'Capacitación en Gestión Empresarial', description: 'Programa de formación para emprendedoras en administración y ventas', status: 'pendiente', assignedTo: 'Mujeres Emprendedoras ONG', dueDate: '2024-07-31T23:59:59Z', estimatedHours: 28, actualHours: null, projectId: 2, takenBy: null, createdBy: 1, isCoverageRequest: false, createdAt: '2024-02-15T09:00:00Z', updatedAt: '2024-02-15T09:00:00Z', taskType: { id: 7, title: 'Capacitación' } }
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
          { id: 8, title: 'Adquisición de Equipos Médicos', description: 'Compra de equipos para clínicas móviles y laboratorios portátiles', status: 'todo', assignedTo: 'Médicos Sin Fronteras', dueDate: '2023-08-30T23:59:59Z', estimatedHours: 20, actualHours: 20, projectId: 3, takenBy: 5, createdBy: 1, isCoverageRequest: false, createdAt: '2023-06-01T10:00:00Z', updatedAt: '2023-06-20T10:00:00Z', taskType: { id: 8, title: 'Compras' } },
          { id: 9, title: 'Capacitación de Personal', description: 'Formación de voluntarios en atención primaria y primeros auxilios', status: 'todo', assignedTo: 'Cruz Roja Internacional', dueDate: '2023-09-15T23:59:59Z', estimatedHours: 36, actualHours: 36, projectId: 3, takenBy: 6, createdBy: 1, isCoverageRequest: false, createdAt: '2023-06-10T10:00:00Z', updatedAt: '2023-07-01T10:00:00Z', taskType: { id: 9, title: 'Capacitación' } },
          { id: 10, title: 'Implementación de Clínicas', description: 'Despliegue de 5 clínicas móviles en comunidades rurales', status: 'todo', assignedTo: 'Salud Comunitaria ONG', dueDate: '2023-10-01T23:59:59Z', estimatedHours: 80, actualHours: 80, projectId: 3, takenBy: 7, createdBy: 1, isCoverageRequest: false, createdAt: '2023-06-20T10:00:00Z', updatedAt: '2023-09-25T10:00:00Z', taskType: { id: 10, title: 'Operaciones' } },
          { id: 11, title: 'Programa de Vacunación', description: 'Campaña masiva de vacunación infantil y adulta', status: 'todo', assignedTo: 'UNICEF Local', dueDate: '2023-12-31T23:59:59Z', estimatedHours: 50, actualHours: 50, projectId: 3, takenBy: 8, createdBy: 1, isCoverageRequest: false, createdAt: '2023-07-10T10:00:00Z', updatedAt: '2023-12-30T10:00:00Z', taskType: { id: 11, title: 'Salud' } }
        ]
      },
      {
        id: 4,
        name: 'Iniciativa de Energía Renovable Rural',
        description: 'Proyecto colaborativo para instalar paneles solares y sistemas de energía limpia en comunidades sin acceso a electricidad',
        status: 'En Ejecución',
        startDate: '2024-02-01',
        endDate: '2024-11-30',
        tasks: [
          { id: 12, title: 'Evaluación Técnica', description: 'Análisis de viabilidad técnica y diseño de sistemas solares', status: 'todo', assignedTo: 'Ingenieros Sin Fronteras', dueDate: '2024-03-15T23:59:59Z', estimatedHours: 24, actualHours: 24, projectId: 4, takenBy: 9, createdBy: 2, isCoverageRequest: false, createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-20T10:00:00Z', taskType: { id: 12, title: 'Análisis' } },
          { id: 13, title: 'Financiamiento Internacional', description: 'Gestión de fondos con organismos internacionales de desarrollo', status: 'en progreso', assignedTo: 'Fondo Verde Internacional', dueDate: '2024-06-01T23:59:59Z', estimatedHours: 60, actualHours: null, projectId: 4, takenBy: 10, createdBy: 2, isCoverageRequest: true, createdAt: '2024-02-05T09:00:00Z', updatedAt: '2024-03-15T10:00:00Z', taskType: { id: 13, title: 'Financiamiento' } },
          { id: 14, title: 'Instalación de Paneles', description: 'Montaje de sistemas solares en 20 comunidades rurales', status: 'pendiente', assignedTo: 'Energía Limpia ONG', dueDate: '2024-11-30T23:59:59Z', estimatedHours: 100, actualHours: null, projectId: 4, takenBy: null, createdBy: 2, isCoverageRequest: true, createdAt: '2024-02-10T11:00:00Z', updatedAt: '2024-02-10T11:00:00Z', taskType: { id: 14, title: 'Instalación de paneles solares o eólicos' } },
          { id: 15, title: 'Capacitación Comunitaria', description: 'Formación de técnicos locales en mantenimiento de sistemas', status: 'pendiente', assignedTo: 'Desarrollo Rural Sostenible', dueDate: '2024-10-15T23:59:59Z', estimatedHours: 48, actualHours: null, projectId: 4, takenBy: null, createdBy: 2, isCoverageRequest: false, createdAt: '2024-02-12T08:00:00Z', updatedAt: '2024-02-12T08:00:00Z', taskType: { id: 15, title: 'Capacitación' } }
        ]
      }
    ];

    const normalized = (statuses || []).map(s => s.trim().toLowerCase());
    const filtered = normalized.length
      ? projects.filter(p => normalized.includes(p.status.toLowerCase()))
      : projects;

    return of({ success: true, data: filtered, message: 'Proyectos mock' });
  }
  

  /**
   * Creates a new project by calling the backend API
   * @param projectData The project data to send to the API
   * @returns Observable with the API response
   */
  createProject(projectData: CreateProjectRequest): Observable<ApiResponse<any>> {
    return this.http.post<any>(this.apiUrl + '/', projectData, this.httpOptions)
      .pipe(
        map(response => ({
          success: true,
          data: response,
          message: 'Proyecto creado exitosamente'
        })),
        catchError(error => {
          console.error('Error creating project:', error);
          const errorMessage = error.error?.message || error.message || 'Error desconocido al crear el proyecto';
          return [{
            success: false,
            error: errorMessage,
            message: 'Error al crear el proyecto'
          }];
        })
      );
  }

  /**
   * Gets all projects from the API
   * @returns Observable with the list of projects
   */
  // getProjects(): Observable<ApiResponse<any[]>> {
  //   return this.http.get<any[]>(this.apiUrl, this.httpOptions)
  //     .pipe(
  //       map(response => ({
  //         success: true,
  //         data: response,
  //         message: 'Proyectos obtenidos exitosamente'
  //       })),
  //       catchError(error => {
  //         console.error('Error fetching projects:', error);
  //         const errorMessage = error.error?.message || error.message || 'Error desconocido al obtener proyectos';
  //         return [{
  //           success: false,
  //           error: errorMessage,
  //           message: 'Error al obtener proyectos'
  //         }];
  //       })
  //     );
  // }

  /**
   * Gets a specific project by ID
   * @param id The project ID
   * @returns Observable with the project data
   */
  getProjectById(id: string): Observable<ApiResponse<any>> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        map(response => ({
          success: true,
          data: response,
          message: 'Proyecto obtenido exitosamente'
        })),
        catchError(error => {
          console.error('Error fetching project:', error);
          const errorMessage = error.error?.message || error.message || 'Error desconocido al obtener el proyecto';
          return [{
            success: false,
            error: errorMessage,
            message: 'Error al obtener el proyecto'
          }];
        })
      );
  }
}