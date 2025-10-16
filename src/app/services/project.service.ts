import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
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
  getProjects(): Observable<ApiResponse<any[]>> {
    return this.http.get<any[]>(this.apiUrl, this.httpOptions)
      .pipe(
        map(response => ({
          success: true,
          data: response,
          message: 'Proyectos obtenidos exitosamente'
        })),
        catchError(error => {
          console.error('Error fetching projects:', error);
          const errorMessage = error.error?.message || error.message || 'Error desconocido al obtener proyectos';
          return [{
            success: false,
            error: errorMessage,
            message: 'Error al obtener proyectos'
          }];
        })
      );
  }

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