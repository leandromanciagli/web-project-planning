import { Task } from "./task.model";

export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  ownerId: number;
  tasks: Task[];
}
