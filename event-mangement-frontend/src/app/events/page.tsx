'use client';

import {
    Container,
    Typography,
    Box,
    Grid,
    Pagination,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
} from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/ui/EventCard';
import { EventFiltersComponent } from '@/components/ui/EventFilters';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DeleteDialog } from '@/components/ui/DeleteDialog';
import { useNotification } from '@/context/NotificationContext';
import { eventsApi } from '@/lib/api';
import { Event } from '@/lib/types';
import { ITEMS_PER_PAGE_OPTIONS } from '@/lib/constants';

export default function EventsPage() {
    const router = useRouter();
    const { showNotification } = useNotification();
    const { data, loading, error, filters, updateFilters, refetch } = useEvents();

    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; event: Event | null }>({
        open: false,
        event: null,
    });
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        updateFilters({ ...filters, page });
    };

    const handleLimitChange = (limit: number) => {
        updateFilters({ ...filters, limit, page: 1 });
    };

    const handleDeleteClick = (event: Event) => {
        setDeleteDialog({ open: true, event });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.event) return;

        try {
            setDeleteLoading(true);
            await eventsApi.deleteEvent(deleteDialog.event.id);
            showNotification('Подію успішно видалено', 'success');
            setDeleteDialog({ open: false, event: null });
            refetch();
        } catch (err) {
            showNotification('Помилка видалення події', 'error');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ open: false, event: null });
    };

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <ErrorMessage message={error} onRetry={refetch} />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Paper
                elevation={3}
                className="glass animate-fadeInUp"
                sx={{ p: 4, borderRadius: 4 }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" className="gradient-text">
                        Події
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddOutlined />}
                        onClick={() => router.push('/events/create')}
                        className="hover-lift"
                    >
                        Створити подію
                    </Button>
                </Box>

                <EventFiltersComponent
                    filters={filters}
                    onFiltersChangeAction={updateFilters}
                />

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="body1" color="text.secondary">
                                {data?.pagination.total ? (
                                    `Знайдено ${data.pagination.total} подій`
                                ) : (
                                    'Події не знайдено'
                                )}
                            </Typography>

                            <FormControl size="small" sx={{ minWidth: 140 }}>
                                <InputLabel>На сторінці</InputLabel>
                                <Select
                                    value={filters.limit || 12}
                                    label="На сторінці"
                                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                                >
                                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {data?.events.length ? (
                            <>
                                <Grid container spacing={3}>
                                    {data.events.map((event, idx) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            lg={4}
                                            key={event.id}
                                            className="animate-fadeInUp"
                                            style={{ animationDelay: `${idx * 0.05}s` }}
                                        >
                                            <EventCard
                                                event={event}
                                                onDelete={handleDeleteClick}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>

                                {data.pagination.totalPages > 1 && (
                                    <Box display="flex" justifyContent="center" mt={4}>
                                        <Pagination
                                            count={data.pagination.totalPages}
                                            page={data.pagination.page}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="large"
                                        />
                                    </Box>
                                )}
                            </>
                        ) : (
                            <Box textAlign="center" py={8} className="animate-fadeIn">
                                <Typography variant="h6" color="text.secondary" mb={2}>
                                    Події не знайдено
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={3}>
                                    Спробуйте змінити критерії пошуку або створити нову подію
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddOutlined />}
                                    onClick={() => router.push('/events/create')}
                                    className="hover-lift"
                                >
                                    Створити першу подію
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </Paper>

            <DeleteDialog
                open={deleteDialog.open}
                title={deleteDialog.event?.title || ''}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
            />
        </Container>
    );
}
