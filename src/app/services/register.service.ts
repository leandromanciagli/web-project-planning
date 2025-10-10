import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUserRequest, ApiResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
    private apiUrl = 'http://localhost:5001/api/v1/users/';

    constructor(private http: HttpClient) { }

    registerUser(data: CreateUserRequest): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(this.apiUrl, data);
    }
}
