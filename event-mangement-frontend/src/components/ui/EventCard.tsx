import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Button,
    Box,
    IconButton,
    Tooltip,
    Avatar,
    CardMedia,
    useTheme
} from '@mui/material';
import {
    CalendarTodayOutlined,
    LocationOnOutlined,
    EditOutlined,
    DeleteOutlined,
    ShareOutlined,
    FavoriteOutlined,
    FavoriteBorderOutlined,
    MapOutlined,
    AccessTimeOutlined,
    VisibilityOutlined,
    BusinessOutlined,
    SchoolOutlined,
    SportsEsportsOutlined,
    MusicNoteOutlined,
    ComputerOutlined,
    PaletteOutlined,
    TheaterComedyOutlined,
    WorkOutlined,
    MenuBookOutlined,
    CelebrationOutlined,
    GroupsOutlined,
    ExtensionOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
import { Event } from '@/lib/types';
import { formatDate, truncateText, getEventStatusColor } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface EventCardProps {
    event: Event;
    onEdit?: (event: Event) => void;
    onDelete?: (event: Event) => void;
    showActions?: boolean;
    showExtendedInfo?: boolean;
    compact?: boolean;
}

const getCategoryIcon = (category: string) => {
    const icons = {
        'Конференція': <BusinessOutlined />,
        'Семінар': <MenuBookOutlined />,
        'Воркшоп': <WorkOutlined />,
        'Мітап': <GroupsOutlined />,
        'Концерт': <MusicNoteOutlined />,
        'Спорт': <SportsEsportsOutlined />,
        'Освіта': <SchoolOutlined />,
        'Бізнес': <BusinessOutlined />,
        'Технології': <ComputerOutlined />,
        'Мистецтво': <PaletteOutlined />,
        'Культура': <TheaterComedyOutlined />,
        'Інше': <ExtensionOutlined />,
    };
    return icons[category as keyof typeof icons] || <CelebrationOutlined />;
};

const getCategoryGradient = (category: string) => {
    const gradients = {
        'Конференція': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'Семінар': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'Воркшоп': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'Мітап': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'Концерт': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        'Спорт': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'Освіта': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'Бізнес': 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        'Технології': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        'Мистецтво': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'Культура': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        'Інше': 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
    };
    return gradients[category as keyof typeof gradients] || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
};

export const EventCard = ({
                              event,
                              onEdit,
                              onDelete,
                              showActions = true,
                              showExtendedInfo = false,
                              compact = false
                          }: EventCardProps) => {
    const router = useRouter();
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    const handleCardClick = () => {
        router.push(`/events/${event.id}`);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) onEdit(event);
        else router.push(`/events/${event.id}/edit`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) onDelete(event);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: event.description,
                url: `${window.location.origin}/events/${event.id}`,
            });
        } else {
            navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`);
        }
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavorited(!isFavorited);
    };

    const handleMapClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (event.mapUrl) {
            window.open(event.mapUrl, '_blank');
        }
    };

    const isUpcoming = new Date(event.date) > new Date();
    const eventStatus = getEventStatusColor(event.date);
    const formattedDate = formatDate(event.date);
    const categoryGradient = getCategoryGradient(event.category);

    return (
        <Card
            sx={{
                height: compact ? 'auto' : '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 20px 40px rgba(0, 0, 0, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.05)',
                '&:hover .card-actions': {
                    opacity: 1,
                    transform: 'translateY(0)',
                },
                overflow: 'visible',
                background: '#ffffff',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: 3,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 2,
                }}
            >
                <Chip
                    label={isUpcoming ? 'Майбутня' : 'Минула'}
                    size="small"
                    color={eventStatus}
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                    }}
                />
            </Box>

            <CardMedia
                sx={{
                    height: compact ? 120 : 160,
                    background: categoryGradient,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                }}
            >
                <Avatar
                    sx={{
                        width: 56,
                        height: 56,
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        fontSize: '1.5rem'
                    }}
                >
                    {getCategoryIcon(event.category)}
                </Avatar>

                <Box
                    className="card-actions"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        display: 'flex',
                        gap: 1,
                        opacity: 0,
                        transform: 'translateY(-10px)',
                        transition: 'all 0.3s ease'
                    }}
                >

                    <Tooltip title="Поділитися">
                        <IconButton
                            size="small"
                            onClick={handleShare}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                            }}
                        >
                            <ShareOutlined />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardMedia>

            <CardContent sx={{ flexGrow: 1, pb: 1 }} onClick={handleCardClick}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography
                        variant={compact ? "subtitle1" : "h6"}
                        component="h2"
                        gutterBottom
                        sx={{
                            lineHeight: 1.3,
                            fontWeight: 600,
                            color: '#1e293b'
                        }}
                    >
                        {truncateText(event.title, compact ? 40 : 60)}
                    </Typography>
                </Box>

                <Box mb={2}>
                    <Chip
                        label={event.category}
                        size="small"
                        sx={{
                            background: categoryGradient,
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                        }}
                    />
                </Box>

                <Box mb={2}>
                    <Box display="flex" alignItems="center" mb={1}>
                        <AccessTimeOutlined
                            fontSize="small"
                            sx={{ mr: 1, color: '#64748b', fontSize: 18 }}
                        />
                        <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                            {formattedDate}
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                        <LocationOnOutlined
                            fontSize="small"
                            sx={{ mr: 1, color: '#64748b', fontSize: 18 }}
                        />
                        <Typography variant="body2" sx={{ color: '#475569', flex: 1 }}>
                            {truncateText(event.location, 30)}
                        </Typography>
                        {event.mapUrl && (
                            <Tooltip title="Відкрити в Google Maps">
                                <IconButton
                                    size="small"
                                    onClick={handleMapClick}
                                    sx={{ ml: 'auto', p: 0.5 }}
                                >
                                    <MapOutlined fontSize="small" color="primary" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>

                {event.description && !compact && (
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2, lineHeight: 1.5 }}>
                        {truncateText(event.description, 100)}
                    </Typography>
                )}

                {showExtendedInfo && (
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            <VisibilityOutlined fontSize="inherit" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                            {Math.floor(Math.random() * 500) + 100} переглядів
                        </Typography>
                    </Box>
                )}
            </CardContent>

            {showActions && (
                <CardActions
                    sx={{
                        justifyContent: 'space-between',
                        px: 2,
                        pb: 2,
                        pt: 0
                    }}
                >
                    <Button
                        size="small"
                        onClick={handleCardClick}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            color: '#6366f1'
                        }}
                    >
                        Детальніше
                    </Button>
                    <Box>
                        <Tooltip title="Редагувати">
                            <IconButton
                                size="small"
                                onClick={handleEdit}
                                sx={{
                                    mr: 1,
                                    color: '#6366f1',
                                    '&:hover': { background: 'rgba(99, 102, 241, 0.1)' }
                                }}
                            >
                                <EditOutlined fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Видалити">
                            <IconButton
                                size="small"
                                onClick={handleDelete}
                                sx={{
                                    color: '#ef4444',
                                    '&:hover': { background: 'rgba(239, 68, 68, 0.1)' }
                                }}
                            >
                                <DeleteOutlined fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </CardActions>
            )}
        </Card>
    );
};