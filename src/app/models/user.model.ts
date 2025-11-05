export interface CreateUserRequest {
    id?: number;
    username: string;
    password: string;
    organizationName: string;
    roles: string[];
}

export interface Role {
    id: string;
    name: string;
}

export interface User {
    id?: number;
    username: string;
    password?: string;
    organizationName: string;
    roles: Role[];
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}