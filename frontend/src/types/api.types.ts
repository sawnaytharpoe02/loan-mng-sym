
// Base interface mapping to the backend's PaginationMeta
export interface PaginationMeta {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageSize: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
}

// Base interface mapping to the backend's ApiResponse
export interface IResponse<T = unknown> {
    success: boolean;
    message: string;
    statusCode: number;
    data?: T;
    pagination?: PaginationMeta;
    errors?: unknown;
}

// Reusable parameter type for paginated/search requests
export type Params = {
    page?: number;
    limit?: number;
    search?: string;
    [key: string]: any;
};
