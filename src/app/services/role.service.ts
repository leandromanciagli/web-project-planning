import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role, ApiResponse } from '@/models/role.model';



@Injectable({ providedIn: 'root' })
export class RoleService {
  private apiUrl = 'http://localhost:5001/api/v1/roles';

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<ApiResponse<Role[]>>(`${this.apiUrl}/all`).pipe(
      map(response => response.data || [])
    );
  }
}

