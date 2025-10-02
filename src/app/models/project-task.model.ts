import { Task } from "./Task";

export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  ownerId: number;
  tasks: Task[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
