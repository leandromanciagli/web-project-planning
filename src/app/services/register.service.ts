import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/users/register'; // tu endpoint de backend

    constructor(private http: HttpClient) { }

    registerUser(data: any): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }
}
