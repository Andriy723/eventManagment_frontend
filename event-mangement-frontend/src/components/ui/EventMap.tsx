'use client';

import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    Chip,
    Button,
    Grid,
    IconButton,
    Tooltip,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    Stack,
    Badge,
} from '@mui/material';
import {
    LocationOnOutlined,
    DirectionsOutlined,
    SearchOutlined,
    LinkOutlined,
    MapOutlined,
    AccessTimeOutlined,
    TrendingUpOutlined,
} from '@mui/icons-material';
import { Event } from '@/lib/types';
import { formatDate, isEventUpcoming } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { EVENT_CATEGORIES } from '@/lib/constants';

interface EventMapProps {
    events: Event[];
    height?: string | number;
    onEventSelect?: (event: Event) => void;
    selectedCategory?: string;
    onCategoryChange?: (category: string) => void;
}

export const EventMap = ({
                             events,
                             height = 500,
                             onEventSelect,
                             selectedCategory = '',
                             onCategoryChange
                         }: EventMapProps) => {
    const router = useRouter();

    const eventsWithLocation = events.filter(
        event => event.location && event.location.trim() !== ''
    );

    const upcomingEvents = eventsWithLocation.filter(event => isEventUpcoming(event.date));
    const pastEvents = eventsWithLocation.filter(event => !isEventUpcoming(event.date));

    const categoryStats = eventsWithLocation.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const handleOpenMapUrl = (mapUrl: string, eventTitle: string) => {
        try {
            window.open(mapUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error opening map URL:', error);
        }
    };

    const handleSearchLocation = (location: string, eventTitle: string) => {
        try {
            const searchQuery = encodeURIComponent(`${location}`);
            const mapsUrl = `https://www.google.com/maps/search/${searchQuery}`;
            window.open(mapsUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error searching location:', error);
        }
    };

    const handleGetDirections = (location: string) => {
        try {
            const destination = encodeURIComponent(location);
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
            window.open(directionsUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error getting directions:', error);
        }
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            'Конференція': '#667eea',
            'Семінар': '#48bb78',
            'Воркшоп': '#ed8936',
            'Мітап': '#f56565',
            'Концерт': '#9f7aea',
            'Спорт': '#4299e1',
            'Освіта': '#38b2ac',
            'Бізнес': '#718096',
            'Технології': '#667eea',
            'Мистецтво': '#d69e2e',
            'Культура': '#805ad5',
            'Інше': '#a0aec0',
        };
        return colors[category as keyof typeof colors] || '#667eea';
    };

    if (eventsWithLocation.length === 0) {
        return (
            <Box sx={{
                height,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                p: 3
            }}>
                {onCategoryChange && events.length > 0 && (
                    <Box sx={{ mb: 4, width: '100%', maxWidth: 400 }}>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    '&.Mui-focused': {
                                        color: '#ffffff',
                                    },
                                    '&.MuiInputLabel-shrink': {
                                        px: 1,
                                        borderRadius: '4px',
                                        backgroundColor: 'rgba(0,0,0,1)',
                                        color: '#ffffff'
                                    },
                                }}
                            >
                                Категорія
                            </InputLabel>

                            <Select
                                value={selectedCategory}
                                onChange={(e) => onCategoryChange?.(e.target.value)}
                                renderValue={(selected) => (selected ? selected : 'Всі категорії')}
                                sx={{
                                    color: '#ffffff',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255,255,255,0.3)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255,255,255,0.5)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#ffffff',
                                    },
                                    '.MuiSvgIcon-root': {
                                        color: '#ffffff',
                                    },
                                }}
                            >
                                <MenuItem value="">
                                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                        <span>Всі категорії</span>
                                        <Badge
                                            badgeContent={events.length}
                                            color="primary"
                                            sx={{ ml: 2 }}
                                        />
                                    </Box>
                                </MenuItem>
                                {EVENT_CATEGORIES.map((category) => {
                                    const categoryCount = events.filter(e => e.category === category).length;
                                    if (categoryCount === 0) return null;

                                    return (
                                        <MenuItem key={category} value={category}>
                                            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                                <span>{category}</span>
                                                <Badge
                                                    badgeContent={categoryCount}
                                                    color="primary"
                                                    sx={{ ml: 2 }}
                                                />
                                            </Box>
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                )}

                <Paper
                    sx={{
                        width: '100%',
                        maxWidth: 600,
                        p: 6,
                        textAlign: 'center',
                        background: 'linear-gradient(145deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                        border: '2px dashed rgba(102, 126, 234, 0.2)',
                        borderRadius: 4,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            mx: 'auto',
                            mb: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontSize: '3rem',
                            color: '#ffffff'
                        }}
                    >
                        📍
                    </Avatar>
                    <Typography variant="h5" gutterBottom sx={{fontWeight: 700, color: '#ffffff'}}>
                        {selectedCategory
                            ? `Немає подій з локаціями в категорії "${selectedCategory}"`
                            : 'Немає подій з локаціями'
                        }
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)' }}>
                        {events.length > 0
                            ? 'Спробуйте вибрати іншу категорію або додайте локацію до існуючих подій.'
                            : 'Щоб події відображались на карті, додайте локацію при створенні події.'
                        }
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            onClick={() => router.push('/events/create')}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                fontWeight: 600,
                                color: '#ffffff'
                            }}
                        >
                            Створити подію з локацією
                        </Button>
                        {events.length > 0 && (
                            <Button
                                variant="outlined"
                                onClick={() => router.push('/events')}
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    color: '#ffffff',
                                    '&:hover': {
                                        borderColor: '#ffffff',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                Переглянути всі події
                            </Button>
                        )}
                    </Stack>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{height, width: '100%', display: 'flex', flexDirection: 'column'}}>
            <Paper
                sx={{
                    height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: '#ffffff',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        p: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        flexShrink: 0,
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
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center">
                                <Avatar
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        mr: 3,
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        color: '#ffffff'
                                    }}
                                >
                                    <MapOutlined fontSize="large" />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{fontWeight: 700, color: '#ffffff'}}>
                                        Карта подій ({eventsWithLocation.length})
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9, color: '#ffffff' }}>
                                        {upcomingEvents.length} майбутніх • {pastEvents.length} минулих
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} gap={2}>
                                {onCategoryChange && (
                                    <FormControl size="small" sx={{ minWidth: 200 }}>
                                        <InputLabel
                                            shrink
                                            sx={{
                                                color: '#ffffff',
                                                '&.Mui-focused': {
                                                    color: '#ffffff !important',
                                                },
                                                '&.MuiInputLabel-shrink': {
                                                    color: '#000000 !important',
                                                    background: 'rgb(255,255,255,0.8)',
                                                    padding: '0 6px',
                                                    borderRadius: '6px',
                                                },
                                            }}
                                        >
                                            Категорія
                                        </InputLabel>

                                        <Select
                                            value={selectedCategory}
                                            onChange={(e) => onCategoryChange(e.target.value)}
                                            renderValue={(selected) => (selected ? selected : 'Всі категорії')}
                                            sx={{
                                                color: '#ffffff',
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)',
                                                '.MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255,255,255,0.3)',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255,255,255,0.5)',
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#ffffff',
                                                },
                                                '.MuiSvgIcon-root': {
                                                    color: '#ffffff',
                                                },
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        backgroundColor: '#ffffff',
                                                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                                        borderRadius: 2,
                                                        mt: 1,
                                                        maxHeight: 300,
                                                        '& .MuiMenuItem-root': {
                                                            color: '#2d3748',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                                            },
                                                            '&.Mui-selected': {
                                                                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(102, 126, 234, 0.3)',
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="">
                                                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                                    <span>Всі категорії</span>
                                                    <Badge
                                                        badgeContent={eventsWithLocation.length}
                                                        color="primary"
                                                        sx={{ ml: 2 }}
                                                    />
                                                </Box>
                                            </MenuItem>
                                            {EVENT_CATEGORIES.map((category) => {
                                                const count = categoryStats[category];
                                                if (!count) return null;

                                                return (
                                                    <MenuItem key={category} value={category}>
                                                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                                            <span>{category}</span>
                                                            <Badge
                                                                badgeContent={count}
                                                                color="primary"
                                                                sx={{ ml: 2 }}
                                                            />
                                                        </Box>
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                )}

                                <Button
                                    variant="outlined"
                                    startIcon={<TrendingUpOutlined />}
                                    onClick={() => router.push('/events')}
                                    sx={{
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        color: '#ffffff',
                                        '&:hover': {
                                            borderColor: '#ffffff',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                >
                                    Список
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>
                                <Paper sx={{
                                    p: 2,
                                    background: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(10px)',
                                    textAlign: 'center',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                                        {upcomingEvents.length}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                        Майбутніх
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Paper sx={{
                                    p: 2,
                                    background: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(10px)',
                                    textAlign: 'center',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                                        {pastEvents.length}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                        Минулих
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Paper sx={{
                                    p: 2,
                                    background: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(10px)',
                                    textAlign: 'center',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                                        {Object.keys(categoryStats).length}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                        Категорій
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Paper sx={{
                                    p: 2,
                                    background: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(10px)',
                                    textAlign: 'center',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                                        {eventsWithLocation.filter(e => e.mapUrl).length}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                        З картами
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            overflow: 'auto',
                            p: 2,
                            '&::-webkit-scrollbar': {
                                width: 8,
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'rgba(102, 126, 234, 0.1)',
                                borderRadius: 4,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(102, 126, 234, 0.3)',
                                borderRadius: 4,
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: 'rgba(102, 126, 234, 0.5)',
                            },
                        }}
                    >
                        <Grid container spacing={3}>
                            {eventsWithLocation.map((event, index) => {
                                const isUpcoming = isEventUpcoming(event.date);
                                const categoryColor = getCategoryColor(event.category);

                                return (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                                        <Card
                                            sx={{
                                                height: 'auto',
                                                minHeight: '300px',
                                                borderRadius: 3,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                cursor: 'pointer',
                                                background: '#ffffff',
                                                border: `2px solid ${categoryColor}20`,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: `0 20px 60px ${categoryColor}30`,
                                                    borderColor: `${categoryColor}40`,
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '4px',
                                                    background: categoryColor,
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                    <Chip
                                                        label={isUpcoming ? 'Майбутня' : 'Минула'}
                                                        size="small"
                                                        color={isUpcoming ? 'success' : 'default'}
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            color: '#ffffff'
                                                        }}
                                                    />
                                                    <Chip
                                                        label={event.category}
                                                        size="small"
                                                        sx={{
                                                            background: `${categoryColor}20`,
                                                            color: categoryColor,
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            maxWidth: 'calc(100% - 80px)',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    />
                                                </Box>

                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mb: 2,
                                                        color: '#2d3748',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        lineHeight: 1.3,
                                                        fontSize: '1.1rem',
                                                        minHeight: '2.6rem'
                                                    }}
                                                    title={event.title}
                                                >
                                                    {event.title}
                                                </Typography>

                                                <Stack spacing={1.5} sx={{ flex: 1 }}>
                                                    <Box display="flex" alignItems="center">
                                                        <AccessTimeOutlined
                                                            sx={{fontSize: 16, mr: 1.5, color: categoryColor}}/>
                                                        <Typography variant="body2"
                                                                    sx={{color: '#4a5568', fontWeight: 500, fontSize: '0.9rem'}}>
                                                            {formatDate(event.date)}
                                                        </Typography>
                                                    </Box>

                                                    <Box display="flex" alignItems="flex-start">
                                                        <LocationOnOutlined
                                                            sx={{fontSize: 16, mr: 1.5, color: categoryColor, mt: 0.2, flexShrink: 0}}/>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: '#4a5568',
                                                                fontSize: '0.9rem',
                                                                lineHeight: 1.4,
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                flex: 1
                                                            }}
                                                            title={event.location}
                                                        >
                                                            {event.location}
                                                        </Typography>
                                                    </Box>

                                                    {event.mapUrl && (
                                                        <Box display="flex" alignItems="center">
                                                            <LinkOutlined sx={{ fontSize: 14, mr: 1.5, color: categoryColor }} />
                                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                                Доступна карта
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Stack>

                                                <Divider sx={{ my: 2, borderColor: `${categoryColor}20` }} />

                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Stack direction="row" spacing={1}>
                                                        <Tooltip title="Пошук локації" arrow>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSearchLocation(event.location, event.title);
                                                                }}
                                                                sx={{
                                                                    bgcolor: `${categoryColor}15`,
                                                                    color: categoryColor,
                                                                    '&:hover': {
                                                                        bgcolor: `${categoryColor}25`,
                                                                        transform: 'scale(1.1)'
                                                                    }
                                                                }}
                                                            >
                                                                <SearchOutlined fontSize="small"/>
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Прокласти маршрут" arrow>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleGetDirections(event.location);
                                                                }}
                                                                sx={{
                                                                    bgcolor: `${categoryColor}15`,
                                                                    color: categoryColor,
                                                                    '&:hover': {
                                                                        bgcolor: `${categoryColor}25`,
                                                                        transform: 'scale(1.1)'
                                                                    }
                                                                }}
                                                            >
                                                                <DirectionsOutlined fontSize="small"/>
                                                            </IconButton>
                                                        </Tooltip>

                                                        {event.mapUrl && (
                                                            <Tooltip title="Пряме посилання" arrow>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleOpenMapUrl(event.mapUrl!, event.title);
                                                                    }}
                                                                    sx={{
                                                                        bgcolor: `${categoryColor}15`,
                                                                        color: categoryColor,
                                                                        '&:hover': {
                                                                            bgcolor: `${categoryColor}25`,
                                                                            transform: 'scale(1.1)'
                                                                        }
                                                                    }}
                                                                >
                                                                    <LinkOutlined fontSize="small"/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Stack>

                                                    <Button
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (onEventSelect) onEventSelect(event);
                                                            router.push(`/events/${event.id}`);
                                                        }}

                                                        sx={{
                                                            background: categoryColor,
                                                            color: '#ffffff',
                                                            textTransform: 'none',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 600,
                                                            px: 2.5,
                                                            py: 1,
                                                            borderRadius: 2,
                                                            minWidth: 'auto',
                                                            '&:hover': {
                                                                background: categoryColor,
                                                                opacity: 0.9,
                                                                transform: 'scale(1.05)',
                                                            }
                                                        }}
                                                    >
                                                        Деталі
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};