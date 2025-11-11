export interface Role {
    id: string;
    name: string;
    displayName: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}