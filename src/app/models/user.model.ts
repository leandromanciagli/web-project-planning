import { Role } from "./role.model";

export interface User {
    id?: number;
    username: string;
    password?: string;
    organizationName: string;
    roles: Role[];
}

export interface CreateUserRequest {
    id?: number;
    username: string;
    password: string;
    organizationName: string;
    roles: string[];
}