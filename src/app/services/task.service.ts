import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { CreateProjectRequest, ApiResponse } from '@/models/project-task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:5001/api/v1/';
  
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Gets tasks by project ID
   * @param projectId The project ID
   * @returns Observable with the list of tasks
   */
  getCloudTasksByProject(projectId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<any>(`${this.apiUrl}cloud-tasks/${projectId}`, this.httpOptions)
      .pipe(
        map(response => {
          console.log(response);
          return {
            success: true,
            data: response.data || [],
            message: 'Tareas obtenidas exitosamente'
          };
        }),
        catchError(error => {
          console.error('Error getting tasks:', error);
          const errorMessage = error.error?.message || error.message || 'Error desconocido al obtener las tareas';
          return [{
            success: false,
            error: errorMessage,
            message: 'Error al obtener las tareas'
          }];
        })
      );
  }

  /**
   * Gets local tasks by project ID
   * @param projectId The project ID
   * @returns Observable with the list of tasks
   */
  getLocalTasksByProject(projectId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<any>(`${this.apiUrl}tasks/local/${projectId}`, this.httpOptions)
      .pipe(
        map(response => {
          console.log(response);
          return {
            success: true,
            data: response.data || [],
            message: 'Tareas obtenidas exitosamente'
          };
        }),
        catchError(error => {
          console.error('Error getting tasks:', error);
          const errorMessage = error.error?.message || error.message || 'Error desconocido al obtener las tareas';
          return [{
            success: false,
            error: errorMessage,
            message: 'Error al obtener las tareas'
          }];
        })
      );
  }
}