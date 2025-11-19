export interface Task {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    dueDate: string;
    estimatedHours: number;
    status: 'todo' | 'in_progress' | 'done';
    takenBy: number | null;
    createdBy: number;
    taskTypeId: number;
    isCoverageRequest: boolean;
}