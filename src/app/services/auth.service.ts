import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NavbarSection, NavbarService } from './navbar.service';

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


    constructor(
        private http: HttpClient, 
        private router: Router,
        private navbarService: NavbarService
    ) { }

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

    hasRole(role: string): boolean {
        return this.getUser().roles.some((r: any) => { return r.name === role });
    }

    /**
     * Retorna las secciones filtradas según los roles del usuario
     * @returns NavbarSection[] - Secciones disponibles para el usuario
     */
    getSectionsByRoles(): NavbarSection[] {
        const user = this.getUser();
        if (!user || !user.roles || !Array.isArray(user.roles)) {
            return [];
        }
        const userRoles = user.roles.map((r: any) => r.name);
        const allSections = this.navbarService.getSections();
        return allSections.filter(section =>
            section.availableRoles.some(role => userRoles.includes(role))
        );
    }

    /**
     * Obtiene la primera sección disponible según los roles del usuario
     * @returns string - Ruta de la primera sección disponible (sin barra inicial)
     */
    getFirstAvailableSection(): string {
        const sections = this.getSectionsByRoles();
        if (sections.length === 0) {
            return 'my-projects'; // Ruta por defecto
        }
        // Remover la barra inicial si existe
        return sections[0].route.replace(/^\//, '');
    }

}
