import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OngService {
  private readonly apiUrl = 'http://localhost:5001/api/v1';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/users`).pipe(
      map(response => response.data || [])
    );
  }
}
