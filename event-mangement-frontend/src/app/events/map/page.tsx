'use client';

import {
    Container,
    Typography,
    Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { EventMap } from '@/components/ui/EventMap';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { eventsApi } from '@/lib/api';
import { Event } from '@/lib/types';

export default function MapPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await eventsApi.getEvents({
                category: selectedCategory || undefined,
                limit: 100
            });
            setEvents(response.events);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Помилка завантаження подій');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const handleEventSelect = (event: Event) => {
        console.log('Selected event:', event);
    };

    useEffect(() => {
        fetchEvents();
    }, [selectedCategory]);

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box mb={3} textAlign="center">
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: '#fff'
                    }}
                >
                    Карта подій
                </Typography>
                <Typography variant="body1" color="#fff">
                    Знайдіть події поруч з вами
                </Typography>
            </Box>

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <ErrorMessage message={error} onRetry={fetchEvents} />
            ) : (
                <Box sx={{ height: 'calc(100vh - 200px)', minHeight: 600 }}>
                    <EventMap
                        events={events}
                        height="100%"
                        onEventSelect={handleEventSelect}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                </Box>
            )}
        </Container>
    );
}