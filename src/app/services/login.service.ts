import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:5001/api/v1/users';
    private _isLoggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
    isLoggedIn$ = this._isLoggedIn.asObservable();


    constructor(private http: HttpClient, private router: Router) { }

    login(data: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
            tap(response => {
                localStorage.setItem('roles', JSON.stringify(response.user.roles));
                this.setSession(response.token, response.user);
            })
        );
    }

    logout() {
        this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
            next: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('roles');
                this._isLoggedIn.next(false);
                this.router.navigate(['/login']);
            },
            error: (err) => {
                console.error('Error cerrando sesión Bonita:', err);
            }
        });
    }


    setSession(token: string, user: any) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this._isLoggedIn.next(true);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    getRoles(): string[] {
        const roles = localStorage.getItem('roles');
        return roles ? JSON.parse(roles) : [];
    }

    hasRole(role: string): boolean {
        return this.getRoles().includes(role);
    }
}
