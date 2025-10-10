export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    organizationName: string;
    description?: string;
    website?: string;
    phone: string;
    role: 'admin' | 'ong' | 'collaborator';
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}