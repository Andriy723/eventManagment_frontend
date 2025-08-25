import axios, { AxiosError } from 'axios';
import { Event, CreateEventData, UpdateEventData, EventFilters, PaginatedResponse, ApiError } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error: AxiosError<ApiError>) => {
        console.error('API Response Error:', error.response?.status, error.response?.data || error.message);

        let message = 'Щось пішло не так';

        if (error.code === 'ECONNREFUSED') {
            message = 'Не вдається підключитися до сервера. Переконайтеся, що бекенд запущено на порту 3001';
        } else if (error.code === 'TIMEOUT') {
            message = 'Запит перевищив час очікування';
        } else if (error.response) {
            switch (error.response.status) {
                case 404:
                    message = 'Ресурс не знайдено';
                    break;
                case 400:
                    message = error.response.data?.message || 'Неправильний запит';
                    break;
                case 500:
                    message = 'Внутрішня помилка сервера';
                    break;
                default:
                    message = error.response.data?.message || error.message || 'Помилка сервера';
            }
        } else if (error.request) {
            message = 'Не отримано відповідь від сервера';
        }

        throw new Error(message);
    }
);

export const eventsApi = {
    getEvents: async (filters?: EventFilters): Promise<PaginatedResponse<Event>> => {
        const { data } = await api.get('/events', { params: filters });
        return data;
    },

    getEvent: async (id: string): Promise<Event> => {
        if (!id || id.trim() === '') {
            throw new Error('ID події не може бути порожнім');
        }
        const { data } = await api.get(`/events/${id}`);
        return data;
    },

    createEvent: async (eventData: CreateEventData): Promise<Event> => {
        const { data } = await api.post('/events', eventData);
        return data;
    },

    updateEvent: async (id: string, eventData: UpdateEventData): Promise<Event> => {
        if (!id || id.trim() === '') {
            throw new Error('ID події не може бути порожнім');
        }
        const { data } = await api.patch(`/events/${id}`, eventData);
        return data;
    },

    deleteEvent: async (id: string): Promise<void> => {
        if (!id || id.trim() === '') {
            throw new Error('ID події не може бути порожнім');
        }
        await api.delete(`/events/${id}`);
    },
};

export const recommendationsApi = {
    getSimilarEvents: async (eventId: string, limit: number = 5): Promise<Event[]> => {
        if (!eventId || eventId.trim() === '') {
            throw new Error('ID події не може бути порожнім');
        }
        const { data } = await api.get(`/recommendations/similar/${eventId}`, { params: { limit } });
        return data;
    },

    getUpcomingEvents: async (limit: number = 10): Promise<Event[]> => {
        const { data } = await api.get('/recommendations/upcoming', { params: { limit } });
        return data;
    },
};