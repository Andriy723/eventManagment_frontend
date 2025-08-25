'use client';

import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Typography,
    Paper,
    FormHelperText,
    InputAdornment,
    Fade,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    SaveOutlined,
    CancelOutlined,
    EventOutlined,
    LocationOnOutlined,
    CategoryOutlined,
    LinkOutlined,
    DescriptionOutlined,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { CreateEventData, Event } from '@/lib/types';
import { EVENT_CATEGORIES } from '@/lib/constants';
import React from "react";

interface EventFormData {
    title: string;
    description?: string;
    date: string;
    location: string;
    category: string;
    mapUrl?: string | null;
}

const schema = yup.object().shape({
    title: yup.string().required('Назва події є обов\'язковою').max(200, 'Назва не може перевищувати 200 символів'),
    description: yup.string().max(1000, 'Опис не може перевищувати 1000 символів'),
    date: yup.string().required('Дата події є обов\'язковою'),
    location: yup.string().required('Локація є обов\'язковою').max(200, 'Локація не може перевищувати 200 символів'),
    category: yup.string().required('Категорія є обов\'язковою'),
    mapUrl: yup
        .string()
        .trim()
        .url('Посилання має бути валідним URL')
        .max(500, 'Посилання не може перевищувати 500 символів')
        .nullable()
        .notRequired()
});

interface EventFormProps {
    event?: Event;
    onSubmitAction: (data: CreateEventData) => void;
    onCancelAction: () => void;
    loading?: boolean;
}

export const EventForm = ({ event, onSubmitAction, onCancelAction, loading = false }: EventFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<EventFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            title: event?.title || '',
            description: event?.description || '',
            date: event?.date ? event.date : dayjs().add(1, 'day').toISOString(),
            location: event?.location || '',
            category: event?.category || '',
            mapUrl: event?.mapUrl,
        },
    });

    const watchedValues = watch();
    const isFormFilled = watchedValues.title && watchedValues.location && watchedValues.category;

    React.useEffect(() => {
        if (event) {
            reset({
                title: event.title,
                description: event.description || '',
                date: event.date,
                location: event.location,
                category: event.category,
                mapUrl: event.mapUrl || '',
            });
        }
    }, [event, reset]);

    const handleFormSubmit = (data: EventFormData) => {
        const submissionData: CreateEventData = {
            ...data,
            date: dayjs(data.date).toISOString(),
            mapUrl: data.mapUrl && data.mapUrl.trim() !== '' ? data.mapUrl : null,
        };
        onSubmitAction(submissionData);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Fade in timeout={800}>
                <Paper
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px auto',
                                color: 'white',
                                fontSize: '2rem',
                            }}
                        >
                            <EventOutlined fontSize="large" />
                        </Box>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            {event ? 'Редагування події' : 'Створення нової події'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {event
                                ? 'Внесіть необхідні зміни до вашої події'
                                : 'Заповніть форму, щоб створити нову подію'
                            }
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Назва події"
                                            placeholder="Введіть назву вашої події"
                                            error={!!errors.title}
                                            helperText={errors.title?.message}
                                            disabled={loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EventOutlined sx={{ color: '#667eea' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Опис події"
                                            placeholder="Розкажіть більше про вашу подію..."
                                            multiline
                                            rows={4}
                                            error={!!errors.description}
                                            helperText={errors.description?.message || `${(field.value || '').length}/1000 символів`}
                                            disabled={loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                        <DescriptionOutlined sx={{ color: '#667eea' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="date"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <DateTimePicker
                                            label="Дата та час події"
                                            value={value ? dayjs(value) : null}
                                            onChange={(date) => onChange(date ? date.toISOString() : null)}
                                            disabled={loading}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!errors.date,
                                                    helperText: errors.date?.message,
                                                    sx: {
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 3,
                                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.category}>
                                            <InputLabel>Категорія</InputLabel>
                                            <Select
                                                {...field}
                                                label="Категорія"
                                                disabled={loading}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <CategoryOutlined sx={{ color: '#667eea', ml: 1 }} />
                                                    </InputAdornment>
                                                }
                                                sx={{
                                                    borderRadius: 3,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                }}
                                            >
                                                {EVENT_CATEGORIES.map((category) => (
                                                    <MenuItem
                                                        key={category}
                                                        value={category}
                                                        sx={{ borderRadius: 2, margin: '2px 4px' }}
                                                    >
                                                        {category}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.category && (
                                                <FormHelperText>{errors.category.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    name="location"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Локація"
                                            placeholder="Вкажіть місце проведення події"
                                            error={!!errors.location}
                                            helperText={errors.location?.message}
                                            disabled={loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocationOnOutlined sx={{ color: '#e53e3e' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    name="mapUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            fullWidth
                                            label="Посилання на Google Maps (опціонально)"
                                            placeholder="https://maps.google.com/..."
                                            error={!!errors.mapUrl}
                                            helperText={
                                                errors.mapUrl?.message ||
                                                "Вставте посилання на локацію в Google Maps для зручності гостей"
                                            }
                                            disabled={loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LinkOutlined sx={{ color: '#4299e1' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {isFormFilled && (
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                            border: '1px solid rgba(102, 126, 234, 0.2)',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                                            ✨ Форма майже готова! Перевірте всі дані та збережіть подію.
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    gap={3}
                                    mt={2}
                                    flexDirection={{ xs: 'column', sm: 'row' }}
                                >
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelOutlined />}
                                        onClick={onCancelAction}
                                        disabled={loading}
                                        size="large"
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 3,
                                            borderWidth: 2,
                                            '&:hover': {
                                                borderWidth: 2,
                                                transform: 'translateY(-2px)',
                                            }
                                        }}
                                    >
                                        Скасувати
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveOutlined />}
                                        disabled={loading}
                                        size="large"
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                                boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                                                transform: 'translateY(-2px)',
                                            },
                                            '&:disabled': {
                                                background: 'rgba(102, 126, 234, 0.4)',
                                                color: 'rgba(255, 255, 255, 0.7)',
                                            }
                                        }}
                                    >
                                        {loading ? 'Збереження...' : event ? 'Оновити подію' : 'Створити подію'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Fade>
        </LocalizationProvider>
    );
};