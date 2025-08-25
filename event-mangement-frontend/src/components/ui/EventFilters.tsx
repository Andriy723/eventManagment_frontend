'use client';

import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Button,
    Paper,
    Collapse,
    IconButton,
    Typography,
} from '@mui/material';
import {
    FilterListOutlined,
    ExpandMoreOutlined,
    ClearOutlined,
    SearchOutlined,
    TuneOutlined
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import { EventFilters } from '@/lib/types';
import { EVENT_CATEGORIES, SORT_OPTIONS } from '@/lib/constants';

interface EventFiltersProps {
    filters: EventFilters;
    onFiltersChangeAction: (filters: EventFilters) => void;
}

export const EventFiltersComponent = ({ filters, onFiltersChangeAction }: EventFiltersProps) => {
    const [expanded, setExpanded] = useState(false);
    const [localFilters, setLocalFilters] = useState<EventFilters>(filters);

    const handleLocalFilterChange = (field: keyof EventFilters, value: any) => {
        setLocalFilters(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSearch = () => {
        onFiltersChangeAction({
            ...localFilters,
            page: 1,
        });
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            page: 1,
            limit: filters.limit || 12,
        };
        setLocalFilters(clearedFilters);
        onFiltersChangeAction(clearedFilters);
    };

    const hasActiveFilters = Boolean(
        localFilters.category ||
        localFilters.location ||
        localFilters.dateFrom ||
        localFilters.dateTo ||
        localFilters.search
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <Box display="flex" alignItems="center">
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2,
                                color: 'white',
                            }}
                        >
                            <TuneOutlined />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                Фільтри та пошук
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Знайдіть потрібні події
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        {hasActiveFilters && (
                            <Button
                                size="small"
                                startIcon={<ClearOutlined />}
                                onClick={handleClearFilters}
                                sx={{
                                    color: '#64748b',
                                    '&:hover': {
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        color: '#ef4444'
                                    }
                                }}
                            >
                                Очистити
                            </Button>
                        )}
                        <IconButton
                            onClick={() => setExpanded(!expanded)}
                            sx={{
                                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s',
                                color: '#6366f1',
                            }}
                        >
                            <ExpandMoreOutlined />
                        </IconButton>
                    </Box>
                </Box>
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Пошук за назвою"
                            placeholder="Введіть назву події..."
                            value={localFilters.search || ''}
                            onChange={(e) => handleLocalFilterChange('search', e.target.value)}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Сортування</InputLabel>
                            <Select
                                value={localFilters.sortBy || 'date'}
                                label="Сортування"
                                onChange={(e) => handleLocalFilterChange('sortBy', e.target.value)}
                                sx={{ borderRadius: 3 }}
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Порядок</InputLabel>
                            <Select
                                value={localFilters.sortOrder || 'asc'}
                                label="Порядок"
                                onChange={(e) => handleLocalFilterChange('sortOrder', e.target.value)}
                                sx={{ borderRadius: 3 }}
                            >
                                <MenuItem value="asc">За зростанням</MenuItem>
                                <MenuItem value="desc">За спаданням</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<SearchOutlined />}
                            onClick={handleSearch}
                            size="large"
                            sx={{
                                height: '56px',
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            Пошук
                        </Button>
                    </Grid>
                </Grid>

                <Collapse in={expanded}>
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'rgba(99, 102, 241, 0.05)',
                            border: '1px solid rgba(99, 102, 241, 0.1)',
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: 3,
                                fontWeight: 600,
                                color: '#1e293b',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <FilterListOutlined sx={{ mr: 1 }} />
                            Розширені фільтри
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Категорія</InputLabel>
                                    <Select
                                        value={localFilters.category || ''}
                                        label="Категорія"
                                        onChange={(e) => handleLocalFilterChange('category', e.target.value)}
                                        sx={{ borderRadius: 3 }}
                                    >
                                        <MenuItem value="">Всі категорії</MenuItem>
                                        {EVENT_CATEGORIES.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Локація"
                                    placeholder="Введіть місце проведення..."
                                    value={localFilters.location || ''}
                                    onChange={(e) => handleLocalFilterChange('location', e.target.value)}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <DateTimePicker
                                    label="Дата від"
                                    value={localFilters.dateFrom ? dayjs(localFilters.dateFrom) : null}
                                    onChange={(date) => handleLocalFilterChange('dateFrom', date?.toISOString())}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            sx: {
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                }
                                            }
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <DateTimePicker
                                    label="Дата до"
                                    value={localFilters.dateTo ? dayjs(localFilters.dateTo) : null}
                                    onChange={(date) => handleLocalFilterChange('dateTo', date?.toISOString())}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            sx: {
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                }
                                            }
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Box display="flex" justifyContent="center" mt={3}>
                            <Button
                                variant="contained"
                                startIcon={<SearchOutlined />}
                                onClick={handleSearch}
                                size="large"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            >
                                Застосувати фільтри
                            </Button>
                        </Box>
                    </Box>
                </Collapse>
            </Paper>
        </LocalizationProvider>
    );
};