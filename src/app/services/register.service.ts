import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUserRequest, ApiResponse } from '@/models/user.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
    private apiUrl = 'http://localhost:5001/api/v1/users/';

    private readonly httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) { }

    registerUser(data: CreateUserRequest): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(this.apiUrl, data, this.httpOptions);
    }
}

