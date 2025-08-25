'use client';

import { Container, Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { EventForm } from '@/components/ui/EventForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useNotification } from '@/context/NotificationContext';
import { eventsApi } from '@/lib/api';
import { Event, CreateEventData } from '@/lib/types';

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const { showNotification } = useNotification();

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const eventId = params.id as string;

    const fetchEvent = async () => {
        if (!eventId) {
            setError('ID події не знайдено');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            console.log('Fetching event with ID:', eventId);
            const eventData = await eventsApi.getEvent(eventId);
            console.log('Event data received:', eventData);
            setEvent(eventData);
        } catch (err) {
            console.error('Error fetching event:', err);
            const errorMessage = err instanceof Error ? err.message : 'Помилка завантаження події';
            setError(errorMessage);

            if (errorMessage.includes('404') || errorMessage.includes('not found')) {
                setTimeout(() => {
                    router.push('/events');
                }, 3000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: CreateEventData) => {
        if (!eventId) {
            showNotification('ID події не знайдено', 'error');
            return;
        }

        try {
            setSubmitLoading(true);
            console.log('Updating event with ID:', eventId, 'Data:', data);
            const updatedEvent = await eventsApi.updateEvent(eventId, data);
            console.log('Event updated successfully:', updatedEvent);
            showNotification('Подію успішно оновлено', 'success');
            router.push(`/events/${eventId}`);
        } catch (err) {
            console.error('Error updating event:', err);
            const errorMessage = err instanceof Error ? err.message : 'Помилка оновлення події';
            showNotification(errorMessage, 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleCancel = () => {
        if (event) {
            router.push(`/events/${event.id}`);
        } else {
            router.push('/events');
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    if (loading) {
        return (
            <Container maxWidth="md">
                <LoadingSpinner message="Завантаження даних події..." />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <ErrorMessage
                    message={`${error}${error.includes('404') ? '. Перенаправляємо на головну сторінку...' : ''}`}
                    onRetry={fetchEvent}
                />
            </Container>
        );
    }

    if (!event) {
        return (
            <Container maxWidth="md">
                <ErrorMessage
                    message="Подію не знайдено. Перенаправляємо на головну сторінку..."
                    onRetry={fetchEvent}
                />
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box mb={3}>
                <Typography variant="h4" gutterBottom color="white">
                    Редагування події
                </Typography>
                <Typography variant="body1" color="white">
                    Внесіть необхідні зміни до події "{event.title}"
                </Typography>
            </Box>

            <EventForm
                event={event}
                onSubmitAction={handleSubmit}
                onCancelAction={handleCancel}
                loading={submitLoading}
            />
        </Container>
    );
}