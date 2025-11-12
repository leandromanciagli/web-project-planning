import { Injectable } from '@angular/core';

export interface NavbarSection {
    id: number;
    name: string;
    route: string;
    color: string;
    availableRoles: string[];
}

@Injectable({
    providedIn: 'root'
})
export class NavbarService {

    constructor() { }

    /**
     * Retorna todas las secciones disponibles de la navbar
     * @returns NavbarSection[] - Array con las secciones de la navbar
     */
    getSections(): NavbarSection[] {
        return [
            { 
                id: 1, 
                name: 'Mis Proyectos', 
                route: '/my-projects', 
                color: 'bg-indigo-600', 
                availableRoles: ['ONG_PRINCIPAL', 'ONG_SUPERVISORA'] 
            },
            { 
                id: 2, 
                name: 'Colaboraciones', 
                route: '/collaborations', 
                color: 'bg-[#059669]', 
                availableRoles: ['ONG_COLABORADORA', 'ONG_SUPERVISORA'] 
            },
            { 
                id: 3, 
                name: 'Monitoreo y Seguimiento', 
                route: '/monitoring', 
                color: 'bg-orange-500', 
                availableRoles: ['ONG_GERENCIAL', 'ONG_SUPERVISORA'] 
            }
        ];
    }
}

