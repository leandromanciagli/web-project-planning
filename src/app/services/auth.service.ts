import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginRequest {
    username: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:5001/api/v1/auth/login';
    private _isLoggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
    isLoggedIn$ = this._isLoggedIn.asObservable();


    constructor(private http: HttpClient, private router: Router) { }

    login(data: LoginRequest): Observable<any> {
        return this.http.post<any>(this.apiUrl, data).pipe(
            tap(response => {                
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                this._isLoggedIn.next(true);
            })
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this._isLoggedIn.next(false);
        this.router.navigate(['/login']);
    }

    getUser(): any | null {
        return JSON.parse(localStorage.getItem('user') || '{}');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    hasRole(roleId: string): boolean {
        return this.getUser().roles.some((role: any) => { return role.id === roleId });
    }

    /**
     * Obtiene la primera sección disponible según los roles del usuario
     * Basado en las secciones de la navbar
     * @returns string - Ruta de la primera sección disponible
     */
    getFirstAvailableSection(): string {
        const user = this.getUser();
        if (!user || !user.roles || !Array.isArray(user.roles)) {
            return 'my-projects'; // fallback
        }

        const userRoleIds = user.roles.map((role: any) => role.id);

        // Definir las secciones en orden de prioridad
        const sections = [
            { route: 'my-projects', availableRoles: ['ONG_PRINCIPAL'] },
            { route: 'collaborations', availableRoles: ['ONG_COLABORADORA'] },
            { route: 'monitoring', availableRoles: ['ONG_GERENCIAL'] }
        ];

        // Encontrar la primera sección cuyo rol esté disponible para el usuario
        for (const section of sections) {
            const hasRequiredRole = section.availableRoles.some(roleId => 
                userRoleIds.includes(roleId)
            );
            if (hasRequiredRole) {
                return section.route;
            }
        }

        // Si no encuentra ninguna, retornar la primera por defecto
        return 'my-projects';
    }

}
