import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KpiService, KpiData, KpiDateFilter } from '../../services/kpi.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-kpi-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './kpi-dashboard.component.html',
    styleUrls: ['./kpi-dashboard.component.css']
})
export class KpiDashboardComponent implements OnInit, OnDestroy {

    // KPI Data
    totalTasksData: KpiData | null = null;
    todoTasksData: KpiData | null = null;
    inProgressTasksData: KpiData | null = null;
    doneTasksData: KpiData | null = null;

    // Loading states
    isLoadingTotalTasks = false;
    isLoadingTodoTasks = false;
    isLoadingInProgressTasks = false;
    isLoadingDoneTasks = false;

    // Date filter
    dateFilter: KpiDateFilter = {};
    showDateFilter = false;

    // Error handling
    errorMessage = '';
    showError = false;

    // Subscriptions
    private subscriptions: Subscription[] = [];

    // Tooltip
    tooltipVisible = false;
    tooltipContent = '';
    tooltipX = 0;
    tooltipY = 0;
    private tooltipTimeout: any = null;

    constructor(private kpiService: KpiService) { } ngOnInit(): void {
        this.loadAllKpis();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
        }
    }    /**
     * Load all KPIs data
     */
    loadAllKpis(): void {
        this.setAllLoadingStates(true);
        this.hideError();

        const sub = this.kpiService.getAllKpis(this.dateFilter).subscribe({
            next: (data) => {
                // Process Total Tasks
                if (data.totalTasks.success) {
                    this.totalTasksData = data.totalTasks.data!;
                } else {
                    this.showErrorMessage('Error al cargar tareas totales: ' + data.totalTasks.error);
                }

                // Process Todo Tasks
                if (data.todoTasks.success) {
                    this.todoTasksData = data.todoTasks.data!;
                } else {
                    this.showErrorMessage('Error al cargar tareas pendientes: ' + data.todoTasks.error);
                }

                // Process In Progress Tasks
                if (data.inProgressTasks.success) {
                    this.inProgressTasksData = data.inProgressTasks.data!;
                } else {
                    this.showErrorMessage('Error al cargar tareas en progreso: ' + data.inProgressTasks.error);
                }

                // Process Done Tasks
                if (data.doneTasks.success) {
                    this.doneTasksData = data.doneTasks.data!;
                } else {
                    this.showErrorMessage('Error al cargar tareas completadas: ' + data.doneTasks.error);
                }

                this.setAllLoadingStates(false);
            },
            error: (error) => {
                console.error('Error loading KPIs:', error);
                this.showErrorMessage('Error al cargar los KPIs: ' + error.message);
                this.setAllLoadingStates(false);
            }
        });

        this.subscriptions.push(sub);
    }

    /**
     * Load individual KPI
     */
    loadTotalTasks(): void {
        this.isLoadingTotalTasks = true;
        const sub = this.kpiService.getTotalTasks(this.dateFilter).subscribe({
            next: (response) => {
                if (response.success) {
                    this.totalTasksData = response.data!;
                } else {
                    this.showErrorMessage('Error al cargar tareas totales: ' + response.error);
                }
                this.isLoadingTotalTasks = false;
            },
            error: (error) => {
                console.error('Error loading total tasks:', error);
                this.showErrorMessage('Error al cargar tareas totales');
                this.isLoadingTotalTasks = false;
            }
        });
        this.subscriptions.push(sub);
    }

    loadTodoTasks(): void {
        this.isLoadingTodoTasks = true;
        const sub = this.kpiService.getTotalTasksTodo(this.dateFilter).subscribe({
            next: (response) => {
                if (response.success) {
                    this.todoTasksData = response.data!;
                } else {
                    this.showErrorMessage('Error al cargar tareas pendientes: ' + response.error);
                }
                this.isLoadingTodoTasks = false;
            },
            error: (error) => {
                console.error('Error loading todo tasks:', error);
                this.showErrorMessage('Error al cargar tareas pendientes');
                this.isLoadingTodoTasks = false;
            }
        });
        this.subscriptions.push(sub);
    }

    loadInProgressTasks(): void {
        this.isLoadingInProgressTasks = true;
        const sub = this.kpiService.getTotalTasksInProgress(this.dateFilter).subscribe({
            next: (response) => {
                if (response.success) {
                    this.inProgressTasksData = response.data!;
                } else {
                    this.showErrorMessage('Error al cargar tareas en progreso: ' + response.error);
                }
                this.isLoadingInProgressTasks = false;
            },
            error: (error) => {
                console.error('Error loading in-progress tasks:', error);
                this.showErrorMessage('Error al cargar tareas en progreso');
                this.isLoadingInProgressTasks = false;
            }
        });
        this.subscriptions.push(sub);
    }

    loadDoneTasks(): void {
        this.isLoadingDoneTasks = true;
        const sub = this.kpiService.getTotalTasksDone(this.dateFilter).subscribe({
            next: (response) => {
                if (response.success) {
                    this.doneTasksData = response.data!;
                } else {
                    this.showErrorMessage('Error al cargar tareas completadas: ' + response.error);
                }
                this.isLoadingDoneTasks = false;
            },
            error: (error) => {
                console.error('Error loading done tasks:', error);
                this.showErrorMessage('Error al cargar tareas completadas');
                this.isLoadingDoneTasks = false;
            }
        });
        this.subscriptions.push(sub);
    }

    /**
     * Apply date filter and reload data
     */
    applyDateFilter(): void {
        this.loadAllKpis();
    }

    /**
     * Clear date filter and reload data
     */
    clearDateFilter(): void {
        this.dateFilter = {};
        this.loadAllKpis();
    }

    /**
     * Toggle date filter visibility
     */
    toggleDateFilter(): void {
        this.showDateFilter = !this.showDateFilter;
    }

    /**
     * Refresh all data
     */
    refreshData(): void {
        this.loadAllKpis();
    }

    /**
     * Calculate percentage for breakdown
     */
    getPercentage(value: number, total: number): number {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    }

    /**
     * Get chart data for daily tasks
     */
    getChartData(data: KpiData | null): { labels: string[], values: number[] } {
        if (!data || !data.tasksPerDay) {
            return { labels: [], values: [] };
        }

        const labels = data.tasksPerDay.map(item => item.date);
        const values = data.tasksPerDay.map(item => item.total || 0);

        return { labels, values };
    }

    /**
     * Utility methods
     */
    private setAllLoadingStates(loading: boolean): void {
        this.isLoadingTotalTasks = loading;
        this.isLoadingTodoTasks = loading;
        this.isLoadingInProgressTasks = loading;
        this.isLoadingDoneTasks = loading;
    }

    private showErrorMessage(message: string): void {
        this.errorMessage = message;
        this.showError = true;
        setTimeout(() => this.hideError(), 5000);
    }

    hideError(): void {
        this.showError = false;
        this.errorMessage = '';
    }

    /**
     * Format date for display
     */
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    /**
     * Get status icon based on KPI type
     */
    getStatusIcon(type: 'total' | 'todo' | 'progress' | 'done'): string {
        const icons = {
            total: '📊',
            todo: '📋',
            progress: '⏳',
            done: '✅'
        };
        return icons[type];
    }

    /**
     * Get status color based on KPI type
     */
    getStatusColor(type: 'total' | 'todo' | 'progress' | 'done'): string {
        const colors = {
            total: '#3B82F6',
            todo: '#F59E0B',
            progress: '#EF4444',
            done: '#10B981'
        };
        return colors[type];
    }

    /**
     * Get bar height percentage for chart
     */
    getBarHeight(count: number, data: KpiData): number {
        if (!data || !data.tasksPerDay || data.tasksPerDay.length === 0) {
            return 0;
        }
        const maxCount = Math.max(...data.tasksPerDay.map(d => d.total || 0));
        if (maxCount === 0) return 0;
        return (count / maxCount) * 100;
    }

    /**
     * Get cloud count from breakdown
     */
    getCloudCount(data: KpiData | null): number {
        if (!data || !data.breakdown) {
            return 0;
        }
        return data.breakdown.cloud || 0;
    }

    /**
     * Get local count from breakdown
     */
    getLocalCount(data: KpiData | null): number {
        if (!data || !data.breakdown) {
            return 0;
        }
        return data.breakdown.local || 0;
    }

    /**
     * Get total count from day data
     */
    getDayTotal(day: any): number {
        return day?.total || 0;
    }

    /**
     * Get chart title for day
     */
    getChartTitle(day: any): string {
        const total = this.getDayTotal(day);
        return `${this.formatDate(day.date)}: ${total} tareas`;
    }

    /**
     * Get bar height for specific day and data
     */
    getDayBarHeight(day: any, data: KpiData): number {
        const total = this.getDayTotal(day);
        return this.getBarHeight(total, data);
    }

    /**
     * Generate line points for SVG polyline
     */
    getLinePoints(data: KpiData): string {
        if (!data || !data.tasksPerDay || data.tasksPerDay.length === 0) {
            return '';
        }

        const maxValue = Math.max(...data.tasksPerDay.map(d => this.getDayTotal(d)));
        const points = data.tasksPerDay.map((day, index) => {
            const x = this.getPointX(index, data.tasksPerDay.length);
            const y = this.getPointY(this.getDayTotal(day), data);
            return `${x},${y}`;
        });

        return points.join(' ');
    }

    /**
     * Get X coordinate for a point in the chart
     */
    getPointX(index: number, totalPoints: number): number {
        const chartWidth = 280; // Leaving margin for points
        const spacing = chartWidth / Math.max(totalPoints - 1, 1);
        return 10 + (index * spacing);
    }

    /**
     * Get Y coordinate for a point in the chart
     */
    getPointY(value: number, data: KpiData): number {
        if (!data || !data.tasksPerDay || data.tasksPerDay.length === 0) {
            return 100;
        }

        const maxValue = Math.max(...data.tasksPerDay.map(d => this.getDayTotal(d)), 1);
        const chartHeight = 80; // Leaving margin
        const percentage = value / maxValue;
        return 100 - (percentage * chartHeight); // Invert Y axis (SVG origin is top-left)
    }

    /**
     * Show tooltip on point hover
     */
    showTooltip(event: MouseEvent, day: any, taskType: string): void {
        // Clear any existing timeout
        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
        }

        const total = this.getDayTotal(day);
        const formattedDate = this.formatDate(day.date);

        this.tooltipContent = `${formattedDate}<br><strong>${total} ${taskType}</strong>`;

        // Position tooltip away from cursor to avoid hover conflicts
        this.tooltipX = event.clientX + 15;
        this.tooltipY = event.clientY - 25;

        // Add small delay to prevent flickering
        this.tooltipTimeout = setTimeout(() => {
            this.tooltipVisible = true;
        }, 100);
    }

    /**
     * Hide tooltip
     */
    hideTooltip(): void {
        // Clear any show timeout
        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
        }

        // Add small delay to hide to prevent flickering when moving between close points
        this.tooltipTimeout = setTimeout(() => {
            this.tooltipVisible = false;
        }, 150);
    }

    /**
     * Get task type label for tooltip
     */
    getTaskTypeLabel(data: KpiData): string {
        if (data === this.totalTasksData) return 'tareas totales';
        if (data === this.todoTasksData) return 'tareas pendientes';
        if (data === this.inProgressTasksData) return 'tareas en progreso';
        if (data === this.doneTasksData) return 'tareas completadas';
        return 'tareas';
    }
}