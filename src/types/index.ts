export * from './incident.types';
export * from './livestock.types';
export * from './user.types';
export * from './geospatial.types';
export * from './enums';

// Common API response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiError {
    status: number;
    message: string;
    details?: string[];
}