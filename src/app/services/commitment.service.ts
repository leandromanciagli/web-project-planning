import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Commitment } from '@/models/commitment.model';
import { ApiResponse } from '@/models/rest.model';



@Injectable({ providedIn: 'root' })
export class CommitmentService {
  private apiUrl = 'http://localhost:5001/api/v1';

  constructor(private http: HttpClient) { }

  createCommitment(commitment: Commitment): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cloud-tasks/extension/commitment`, { ...commitment, username: 'walter.bates', password: 'bpm' }).pipe(
      map(response => response.data || [])
    );
  }

  getCommitmentsByTask(taskId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cloud-tasks/extension/commitmentsByTask`, { taskId, username: 'walter.bates', password: 'bpm' }).pipe(
      map(response => response.data || [])
    );
  }

  assignCommitment(projectId: number, taskId: number, commitmentId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cloud-tasks/extension/assignCommitment`, { projectId, taskId, commitmentId, username: 'walter.bates', password: 'bpm' }).pipe(
      map(response => response.data || [])
    );
  }

  markCommitmentDone(commitmentId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cloud-tasks/extension/commitmentDone`, { commitmentId, username: 'walter.bates', password: 'bpm' }).pipe(
      map(response => response.data || [])
    );
  }
}

