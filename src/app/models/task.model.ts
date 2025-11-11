export interface Task {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    dueDate: string;
    estimatedHours: number;
    status: 'todo' | 'in-progress' | 'completed' | 'on-hold';
    taskTypeId: number;
    isCoverageRequest: boolean;
}