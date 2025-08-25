'use client';

import { useState, useEffect } from 'react';
import { Event, EventFilters, PaginatedResponse } from '@/lib/types';
import { eventsApi } from '@/lib/api';

export const useEvents = (initialFilters?: EventFilters) => {
    const [data, setData] = useState<PaginatedResponse<Event> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<EventFilters>(initialFilters || {});

    const fetchEvents = async (currentFilters?: EventFilters) => {
        try {
            setLoading(true);
            setError(null);
            const response = await eventsApi.getEvents(currentFilters || filters);
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const updateFilters = (newFilters: EventFilters) => {
        setFilters(newFilters);
        fetchEvents(newFilters);
    };

    const refetch = () => {
        fetchEvents();
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return {
        data,
        loading,
        error,
        filters,
        updateFilters,
        refetch,
    };
};