'use client';

import { Container, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventForm } from '@/components/ui/EventForm';
import { useNotification } from '@/context/NotificationContext';
import { eventsApi } from '@/lib/api';
import { CreateEventData } from '@/lib/types';

export default function CreateEventPage() {
    const router = useRouter();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (data: CreateEventData) => {
        try {
            setLoading(true);
            await eventsApi.createEvent(data);
            showNotification('Подію успішно створено', 'success');
            router.push('/events');
        } catch (err) {
            showNotification(err instanceof Error ? err.message : 'Помилка створення події', 'error');
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        router.push('/events');
    };

    return (
        <Container maxWidth="md">
            <Box mb={3}>
                <Typography variant="h4" gutterBottom color="white">
                    Створення нової події
                </Typography>
                <Typography variant="body1" color="white">
                    Заповніть форму для створення нової події
                </Typography>
            </Box>

            <EventForm
                onSubmitAction={handleSubmit}
                onCancelAction={handleCancel}
                loading={loading}
            />
        </Container>
    );
}