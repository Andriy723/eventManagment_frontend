'use client';

import {
    Container,
    Typography,
    Box,
    Paper,
    Chip,
    Button,
    Grid,
    Divider,
    IconButton,
    Card,
    CardContent,
    Avatar,
    Stack,
    Link,
    Tooltip,
} from '@mui/material';
import {
    LocationOnOutlined,
    EditOutlined,
    DeleteOutlined,
    ArrowBackOutlined,
    CategoryOutlined,
    LinkOutlined,
    ShareOutlined,
    AccessTimeOutlined,
    MapOutlined,
    PersonOutlined,
    EventOutlined,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EventCard } from '@/components/ui/EventCard';
import { DeleteDialog } from '@/components/ui/DeleteDialog';
import { useNotification } from '@/context/NotificationContext';
import { useRecommendations } from '@/hooks/useRecommendations';
import { eventsApi } from '@/lib/api';
import { Event } from '@/lib/types';
import { formatDate, getEventStatusColor } from '@/lib/utils';

export default function EventDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { showNotification } = useNotification();

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const eventId = params.id as string;
    const { similarEvents, loading: recommendationsLoading } = useRecommendations(eventId);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            setError(null);
            const eventData = await eventsApi.getEvent(eventId);
            setEvent(eventData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Помилка завантаження події');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!event) return;

        try {
            setDeleteLoading(true);
            await eventsApi.deleteEvent(event.id);
            showNotification('Подію успішно видалено', 'success');
            router.push('/events');
        } catch (err) {
            showNotification('Помилка видалення події', 'error');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event?.title,
                text: event?.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            showNotification('Посилання скопійовано в буфер обміну', 'success');
        }
    };

    const handleOpenMap = () => {
        if (event?.mapUrl) {
            window.open(event.mapUrl, '_blank');
        } else if (event?.location) {
            const searchQuery = encodeURIComponent(event.location);
            window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <LoadingSpinner message="Завантаження події..." />
            </Container>
        );
    }

    if (error || !event) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <ErrorMessage message={error || 'Подію не знайдено'} onRetry={fetchEvent} />
            </Container>
        );
    }

    const eventStatus = getEventStatusColor(event.date);
    const isUpcoming = new Date(event.date) > new Date();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={3}>
                <Button
                    startIcon={<ArrowBackOutlined />}
                    onClick={() => router.push('/events')}
                    sx={{
                        color: '#fff',
                        fontWeight: 600,
                        '&:hover': {
                            background: 'rgba(99, 102, 241, 0.1)',
                            transform: 'translateX(-4px)',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    Назад до списку подій
                </Button>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    <Paper
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            background: '#ffffff',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                p: 4,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '200px',
                                    height: '200px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '50%',
                                    transform: 'translate(50px, -50px)',
                                }
                            }}
                        >
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={12} md={8}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                mr: 3,
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                backdropFilter: 'blur(10px)',
                                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            <EventOutlined fontSize="large" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                                                {event.title}
                                            </Typography>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Chip
                                                    label={event.category}
                                                    sx={{
                                                        background: 'rgba(255, 255, 255, 0.2)',
                                                        color: 'white',
                                                        backdropFilter: 'blur(10px)',
                                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                                        fontWeight: 600,
                                                    }}
                                                />
                                                <Chip
                                                    label={isUpcoming ? 'Майбутня' : 'Минула'}
                                                    color={eventStatus}
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Stack>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                        <Tooltip title="Поділитися">
                                            <IconButton
                                                onClick={handleShare}
                                                sx={{
                                                    color: 'white',
                                                    background: 'rgba(255, 255, 255, 0.2)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    '&:hover': {
                                                        background: 'rgba(255, 255, 255, 0.3)',
                                                        transform: 'scale(1.1)',
                                                    }
                                                }}
                                            >
                                                <ShareOutlined />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Редагувати">
                                            <IconButton
                                                onClick={() => router.push(`/events/${event.id}/edit`)}
                                                sx={{
                                                    color: 'white',
                                                    background: 'rgba(255, 255, 255, 0.2)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    '&:hover': {
                                                        background: 'rgba(255, 255, 255, 0.3)',
                                                        transform: 'scale(1.1)',
                                                    }
                                                }}
                                            >
                                                <EditOutlined />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Видалити">
                                            <IconButton
                                                onClick={() => setDeleteDialog(true)}
                                                sx={{
                                                    color: 'white',
                                                    background: 'rgba(239, 68, 68, 0.3)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(239, 68, 68, 0.5)',
                                                    '&:hover': {
                                                        background: 'rgba(239, 68, 68, 0.5)',
                                                        transform: 'scale(1.1)',
                                                    }
                                                }}
                                            >
                                                <DeleteOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        sx={{
                                            background: 'rgba(99, 102, 241, 0.05)',
                                            border: '1px solid rgba(99, 102, 241, 0.1)',
                                            borderRadius: 3,
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box display="flex" alignItems="center" mb={2}>
                                                <Avatar
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        mr: 2,
                                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                    }}
                                                >
                                                    <AccessTimeOutlined />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                        Дата та час
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                        Коли відбудеться подія
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#6366f1' }}>
                                                {formatDate(event.date)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        sx={{
                                            background: 'rgba(236, 72, 153, 0.05)',
                                            border: '1px solid rgba(236, 72, 153, 0.1)',
                                            borderRadius: 3,
                                            cursor: event.mapUrl || event.location ? 'pointer' : 'default',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                transform: event.mapUrl || event.location ? 'translateY(-2px)' : 'none',
                                                boxShadow: event.mapUrl || event.location ? '0 8px 25px rgba(236, 72, 153, 0.15)' : 'none',
                                            }
                                        }}
                                        onClick={handleOpenMap}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box display="flex" alignItems="center" mb={2}>
                                                <Avatar
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        mr: 2,
                                                        background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                                                    }}
                                                >
                                                    <LocationOnOutlined />
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                                        <Box>
                                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                                Локація
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                                Місце проведення
                                                            </Typography>
                                                        </Box>
                                                        {(event.mapUrl || event.location) && (
                                                            <MapOutlined sx={{ color: '#ec4899', ml: 1 }} />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 500,
                                                    color: '#ec4899',
                                                    wordBreak: 'break-word',
                                                    lineHeight: 1.4,
                                                }}
                                                title={event.location}
                                            >
                                                {event.location}
                                            </Typography>
                                            {event.mapUrl && (
                                                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
                                                    Натисніть для відкриття на карті
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        sx={{
                                            background: 'rgba(34, 197, 94, 0.05)',
                                            border: '1px solid rgba(34, 197, 94, 0.1)',
                                            borderRadius: 3,
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box display="flex" alignItems="center" mb={2}>
                                                <Avatar
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        mr: 2,
                                                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                                    }}
                                                >
                                                    <CategoryOutlined />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                        Категорія
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                        Тип події
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#22c55e' }}>
                                                {event.category}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        sx={{
                                            background: 'rgba(59, 130, 246, 0.05)',
                                            border: '1px solid rgba(59, 130, 246, 0.1)',
                                            borderRadius: 3,
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box display="flex" alignItems="center" mb={2}>
                                                <Avatar
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        mr: 2,
                                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                    }}
                                                >
                                                    <PersonOutlined />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                        Створено
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                        Дата створення
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: '#3b82f6' }}>
                                                {formatDate(event.createdAt)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            {event.description && (
                                <>
                                    <Divider sx={{ my: 4, borderColor: 'rgba(226, 232, 240, 0.8)' }} />
                                    <Box>
                                        <Typography
                                            variant="h5"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 700,
                                                color: '#1e293b',
                                                mb: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    mr: 2,
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                    fontSize: '1.2rem',
                                                }}
                                            >
                                                📝
                                            </Avatar>
                                            Опис події
                                        </Typography>
                                        <Paper
                                            sx={{
                                                p: 3,
                                                background: 'rgba(99, 102, 241, 0.02)',
                                                border: '1px solid rgba(99, 102, 241, 0.1)',
                                                borderRadius: 3,
                                                borderLeft: '4px solid #6366f1',
                                            }}
                                        >
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    lineHeight: 1.8,
                                                    fontSize: '1.1rem',
                                                    color: '#475569',
                                                    whiteSpace: 'pre-wrap',
                                                }}
                                            >
                                                {event.description}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                </>
                            )}
                            {event.mapUrl && (
                                <>
                                    <Divider sx={{ my: 4, borderColor: 'rgba(226, 232, 240, 0.8)' }} />
                                    <Box>
                                        <Typography
                                            variant="h5"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 700,
                                                color: '#1e293b',
                                                mb: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    mr: 2,
                                                    background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                                                }}
                                            >
                                                <MapOutlined />
                                            </Avatar>
                                            Розташування на карті
                                        </Typography>
                                        <Paper
                                            sx={{
                                                p: 3,
                                                background: 'rgba(236, 72, 153, 0.02)',
                                                border: '1px solid rgba(236, 72, 153, 0.1)',
                                                borderRadius: 3,
                                                borderLeft: '4px solid #ec4899',
                                            }}
                                        >
                                            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                                                        Google Maps посилання:
                                                    </Typography>
                                                    <Link
                                                        href={event.mapUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{
                                                            color: '#ec4899',
                                                            textDecoration: 'none',
                                                            fontWeight: 500,
                                                            fontSize: '0.95rem',
                                                            wordBreak: 'break-all',
                                                            display: 'block',
                                                            '&:hover': {
                                                                textDecoration: 'underline',
                                                            }
                                                        }}
                                                    >
                                                        {event.mapUrl.length > 60
                                                            ? `${event.mapUrl.substring(0, 60)}...`
                                                            : event.mapUrl
                                                        }
                                                    </Link>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<LinkOutlined />}
                                                    onClick={handleOpenMap}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        borderRadius: 3,
                                                        px: 3,
                                                        flexShrink: 0,
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
                                                            transform: 'translateY(-2px)',
                                                        }
                                                    }}
                                                >
                                                    Відкрити карту
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Paper
                        sx={{
                            borderRadius: 4,
                            background: '#ffffff',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            position: 'sticky',
                            top: 24,
                        }}
                    >
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                p: 3,
                                borderRadius: '16px 16px 0 0',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        mr: 2,
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        fontSize: '1rem',
                                    }}
                                >
                                    ✨
                                </Avatar>
                                Схожі події
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                                Інші події, які можуть вас зацікавити
                            </Typography>
                        </Box>

                        <Box sx={{ p: 3 }}>
                            {recommendationsLoading ? (
                                <LoadingSpinner message="Завантаження рекомендацій..." />
                            ) : similarEvents.length > 0 ? (
                                <Stack spacing={3}>
                                    {similarEvents.map((similarEvent) => (
                                        <EventCard
                                            key={similarEvent.id}
                                            event={similarEvent}
                                            showActions={false}
                                            compact={true}
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <Paper
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        background: 'rgba(99, 102, 241, 0.05)',
                                        border: '1px solid rgba(99, 102, 241, 0.1)',
                                        borderRadius: 3,
                                    }}
                                >
                                    <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                                        🔍 Схожі події не знайдено
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                        Спробуйте переглянути інші події
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.push('/events')}
                                        sx={{ mt: 2 }}
                                    >
                                        Переглянути всі події
                                    </Button>
                                </Paper>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <DeleteDialog
                open={deleteDialog}
                title={event.title}
                onClose={() => setDeleteDialog(false)}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />
        </Container>
    );
}