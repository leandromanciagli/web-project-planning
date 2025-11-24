import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { CreateProjectRequest } from '@/models/project-task.model';
import { ApiResponse } from '@/models/rest.model';

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
   * Gets projects
   * @param filter Filter object with status array and/or createdBy
   * @returns Observable with the list of projects
   */
  getProjects(filter: any): Observable<ApiResponse<any[]>> {
    return this.http.post<any>(`${this.apiUrl}/filter`, filter, this.httpOptions)
      .pipe(
        map(response => {
          return {
            success: true,
            data: response.data || [],
            message: 'Proyectos obtenidos exitosamente'
          };
        }),
        catchError(error => {
          console.error('Error getting projects:', error);
          const errorMessage = error.error?.message || error.message || 'Error desconocido al obtener los proyectos';
          return [{
            success: false,
            error: errorMessage,
            message: 'Error al crear el proyecto'
          }];
        })
      );
  }

  /**
   * Creates a new project
   * @param projectData The project data to send to the API
   * @returns Observable with the API response
   */
  createProject(projectData: CreateProjectRequest): Observable<ApiResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}`, projectData, this.httpOptions)
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
   * Gets project by ID
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

  executeProject(projectId: number): Observable<ApiResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/${projectId}/execute`, {}, this.httpOptions)
      .pipe(
        map(response => ({
          success: true,
          data: response,
          message: 'Proyecto ejecutado exitosamente'
        })),
        catchError(error => {
          console.error('Error executing project:', error);
          const errorMessage = error.error?.message || error.message || 'Error desconocido al ejecutar el proyecto';
          return [{
            success: false,
            error: errorMessage,
            message: 'Error al ejecutar el proyecto'
          }];
        })
      );
  }

  finishProject(projectId: number): Observable<ApiResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/${projectId}/finish`, {}, this.httpOptions)
      .pipe(
        map(response => ({
          success: true,
          data: response,
          message: 'Proyecto finalizado exitosamente'
        })),
      );
  }
}