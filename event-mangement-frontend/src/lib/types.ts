
export interface Event {
    id: string;
    title: string;
    description?: string;
    date: string;
    location: string;
    category: string;
    mapUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEventData {
    title: string;
    description?: string;
    date: string;
    location: string;
    category: string;
    mapUrl?: string | null;
}

export interface UpdateEventData extends Partial<CreateEventData> {}

export interface EventFilters {
    category?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: 'date' | 'title' | 'category' | 'location';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedResponse<T> {
    events: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ApiError {
    statusCode: number;
    message: string;
    error: string;
    timestamp: string;
    path: string;
    method: string;
}