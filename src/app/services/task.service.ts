import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiResponse } from '@/models/rest.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:5001/api/v1';
  
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Get tasks by project ID
   * @param projectId The project ID
   * @returns Observable with the list of tasks
   */
  getTasksByProject(projectId: number): Observable<ApiResponse<any[]>> {
    return this.http.post<any>(`${this.apiUrl}/projects/${projectId}/tasks`, { username: 'walter.bates', password: 'bpm' }, this.httpOptions)
      .pipe(
        map(response => {
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
   * Get tasks by project ID
   * @param projectId The project ID
   * @returns Observable with the list of tasks
   */
  getCloudTasksByProject(projectId: number): Observable<ApiResponse<any[]>> {
    return this.http.post<any>(`${this.apiUrl}/cloud-tasks/extension/getCloudTasksByProject`, { projectId: projectId, username: 'walter.bates', password: 'bpm' }, this.httpOptions)
      .pipe(
        map(response => {
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
    return this.http.get<any>(`${this.apiUrl}/tasks/local/${projectId}`, this.httpOptions)
      .pipe(
        map(response => {
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
   * Marks a local task as done
   * @param taskId The task ID
   * @returns Observable with the result
   */
  markLocalTaskAsDone(taskId: number): Observable<ApiResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/tasks/local/${taskId}/done`, { username: 'walter.bates', password: 'bpm' }, this.httpOptions)
      .pipe(
        map(response => {
          return {
            success: true,
            data: response.data || [],
            message: 'Tarea marcada como cumplida exitosamente'
          };
        }),
        catchError(error => {
          console.error('Error marking task as done:', error);
          const errorMessage = error.error?.message || error.message || 'Error desconocido al marcar la tarea como cumplida';
          return [{
            success: false,
            error: errorMessage,
            message: 'Error al marcar la tarea como cumplida'
          }];
        })
      );
  }
}