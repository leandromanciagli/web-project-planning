import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { ApiResponse } from '../models/rest.model';

export interface KpiData {
    total: number;
    period: {
        startDate: string;
        endDate: string;
        days: number;
    };
    tasksPerDay: Array<{
        date: string;
        total: number;
    }>;
    breakdown: {
        cloud: number;
        local: number;
    };
}

export interface KpiDateFilter {
    startDate?: string;
    endDate?: string;
}

@Injectable({
    providedIn: 'root'
})
export class KpiService {
    private readonly apiUrl = 'http://localhost:5001/api/v1/kpis';

    private readonly httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) { }

    /**
     * Builds query parameters string from filter object
     * @param filter Optional date filter
     * @returns Query parameters string
     */
    private buildQueryParams(filter?: KpiDateFilter): string {
        if (!filter) return '';

        const params = new URLSearchParams();
        if (filter.startDate) params.append('startDate', filter.startDate);
        if (filter.endDate) params.append('endDate', filter.endDate);

        const paramString = params.toString();
        return paramString ? `?${paramString}` : '';
    }

    /**
     * Gets total tasks KPI data
     * @param filter Optional date filter
     * @returns Observable with KPI data for total tasks
     */
    getTotalTasks(filter?: KpiDateFilter): Observable<ApiResponse<KpiData>> {
        const params = this.buildQueryParams(filter);
        return this.http.get<ApiResponse<KpiData>>(`${this.apiUrl}/total-tasks${params}`)
            .pipe(
                catchError(error => {
                    console.error('Error getting total tasks KPI:', error);
                    const errorMessage = error.error?.message || error.message || 'Error desconocido al obtener el KPI de tareas totales';
                    return [{
                        success: false,
                        error: errorMessage,
                        message: 'Error al obtener el KPI de tareas totales'
                    }];
                })
            );
    }

    /**
     * Gets todo tasks KPI data
     * @param filter Optional date filter
     * @returns Observable with KPI data for todo tasks
     */
    getTotalTasksTodo(filter?: KpiDateFilter): Observable<ApiResponse<KpiData>> {
        const params = this.buildQueryParams(filter);
        return this.http.get<ApiResponse<KpiData>>(`${this.apiUrl}/total-tasks-todo${params}`)
            .pipe(
                catchError(error => {
                    console.error('Error getting todo tasks KPI:', error);
                    const errorMessage = error.error?.message || error.message || 'Error desconocido al obtener el KPI de tareas pendientes';
                    return [{
                        success: false,
                        error: errorMessage,
                        message: 'Error al obtener el KPI de tareas pendientes'
                    }];
                })
            );
    }

    /**
     * Gets in-progress tasks KPI data
     * @param filter Optional date filter
     * @returns Observable with KPI data for in-progress tasks
     */
    getTotalTasksInProgress(filter?: KpiDateFilter): Observable<ApiResponse<KpiData>> {
        const params = this.buildQueryParams(filter);
        return this.http.get<ApiResponse<KpiData>>(`${this.apiUrl}/total-tasks-in-progress${params}`)
            .pipe(
                catchError(error => {
                    console.error('Error getting in-progress tasks KPI:', error);
                    const errorMessage = error.error?.message || error.message || 'Error desconocido al obtener el KPI de tareas en progreso';
                    return [{
                        success: false,
                        error: errorMessage,
                        message: 'Error al obtener el KPI de tareas en progreso'
                    }];
                })
            );
    }

    /**
     * Gets done tasks KPI data
     * @param filter Optional date filter
     * @returns Observable with KPI data for completed tasks
     */
    getTotalTasksDone(filter?: KpiDateFilter): Observable<ApiResponse<KpiData>> {
        const params = this.buildQueryParams(filter);
        return this.http.get<ApiResponse<KpiData>>(`${this.apiUrl}/total-tasks-done${params}`)
            .pipe(
                catchError(error => {
                    console.error('Error getting done tasks KPI:', error);
                    const errorMessage = error.error?.message || error.message || 'Error desconocido al obtener el KPI de tareas completadas';
                    return [{
                        success: false,
                        error: errorMessage,
                        message: 'Error al obtener el KPI de tareas completadas'
                    }];
                })
            );
    }

    /**
     * Gets all KPIs data at once
     * @param filter Optional date filter
     * @returns Observable with all KPI data
     */
    getAllKpis(filter?: KpiDateFilter): Observable<{
        totalTasks: ApiResponse<KpiData>;
        todoTasks: ApiResponse<KpiData>;
        inProgressTasks: ApiResponse<KpiData>;
        doneTasks: ApiResponse<KpiData>;
    }> {
        return new Observable(observer => {
            Promise.all([
                this.getTotalTasks(filter).toPromise(),
                this.getTotalTasksTodo(filter).toPromise(),
                this.getTotalTasksInProgress(filter).toPromise(),
                this.getTotalTasksDone(filter).toPromise()
            ]).then(([totalTasks, todoTasks, inProgressTasks, doneTasks]) => {
                observer.next({
                    totalTasks: totalTasks!,
                    todoTasks: todoTasks!,
                    inProgressTasks: inProgressTasks!,
                    doneTasks: doneTasks!
                });
                observer.complete();
            }).catch(error => {
                console.error('Error getting all KPIs:', error);
                observer.error(error);
            });
        });
    }
}