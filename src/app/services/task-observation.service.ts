import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class TaskObservationService {
  private apiUrl = 'http://localhost:5001/api/v1';

  constructor(private http: HttpClient) { }

  getTaskObservations(taskId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cloud-tasks/extension/getTaskObservations`, { taskId: taskId, username: 'walter.bates', password: 'bpm' }).pipe(
      map(response => response.data || [])
    );
  }

  createTaskObservation(taskObservation: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cloud-tasks/extension/taskObservation`, { taskId: taskObservation.taskId, observations: taskObservation.observation, userId: taskObservation.userId, username: 'walter.bates', password: 'bpm' }).pipe(
      map(response => response.data || [])
    );
  }

  resolveTaskObservation(taskObservationId: number, resolution: string, userId: number, bonitaCaseId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cloud-tasks/extension/resolveTaskObservation`, { observationId: taskObservationId, resolution: resolution, userId: userId, bonitaCaseId: bonitaCaseId, username: 'walter.bates', password: 'bpm' }).pipe(
      map(response => response.data || [])
    );
  }
}

