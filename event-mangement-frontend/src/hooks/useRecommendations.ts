'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/lib/types';
import { recommendationsApi } from '@/lib/api';

export const useRecommendations = (eventId?: string, limit: number = 5) => {
    const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSimilarEvents = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const events = await recommendationsApi.getSimilarEvents(id, limit);
            setSimilarEvents(events);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchSimilarEvents(eventId);
        }
    }, [eventId, limit]);

    return {
        similarEvents,
        loading,
        error,
        refetch: eventId ? () => fetchSimilarEvents(eventId) : undefined,
    };
};

export const useUpcomingEvents = (limit: number = 10) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUpcomingEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const upcomingEvents = await recommendationsApi.getUpcomingEvents(limit);
            setEvents(upcomingEvents);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch upcoming events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUpcomingEvents();
    }, [limit]);

    return {
        events,
        loading,
        error,
        refetch: fetchUpcomingEvents,
    };
};