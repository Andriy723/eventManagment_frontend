import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Container,
    useTheme,
    Avatar,
} from '@mui/material';
import {
    EventOutlined,
    AddOutlined,
    MapOutlined,
    MenuOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        handleMenuClose();
    };

    const navigationItems = [
        { path: '/events', label: 'Події', icon: <EventOutlined /> },
        { path: '/events/map', label: 'Карта', icon: <MapOutlined /> },
        { path: '/events/create', label: 'Створити', icon: <AddOutlined /> },
    ];

    const isActivePath = (path: string) => pathname === path;

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                color: '#1e293b',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ py: 1, minHeight: '64px' }}>
                    <Box
                        component={Link}
                        href="/events"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                            mr: 'auto',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                transform: 'scale(1.02)',
                            }
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                mr: 2,
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                            }}
                        >
                            E
                        </Avatar>
                        <Box>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '1.25rem',
                                    lineHeight: 1,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            >
                                EventHub
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    opacity: 0.7,
                                    fontSize: '0.7rem',
                                    color: '#64748b',
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                Керування подіями
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
                        {navigationItems.map((item) => (
                            <Button
                                key={item.path}
                                startIcon={item.icon}
                                onClick={() => router.push(item.path)}
                                sx={{
                                    px: 3,
                                    py: 1,
                                    borderRadius: 3,
                                    fontWeight: 500,
                                    color: isActivePath(item.path) ? 'white' : '#64748b',
                                    background: isActivePath(item.path)
                                        ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                        : 'transparent',
                                    '&:hover': {
                                        background: isActivePath(item.path)
                                            ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                                            : 'rgba(99, 102, 241, 0.1)',
                                        transform: 'translateY(-1px)',
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{
                                background: 'rgba(99, 102, 241, 0.1)',
                                color: '#6366f1',
                                '&:hover': {
                                    background: 'rgba(99, 102, 241, 0.2)',
                                    transform: 'scale(1.05)',
                                }
                            }}
                        >
                            <MenuOutlined />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                sx: {
                                    mt: 1,
                                    borderRadius: 3,
                                    minWidth: 200,
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                                    border: '1px solid rgba(226, 232, 240, 0.8)',
                                }
                            }}
                        >
                            {navigationItems.map((item) => (
                                <MenuItem
                                    key={item.path}
                                    onClick={() => handleNavigation(item.path)}
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        borderRadius: 2,
                                        margin: '4px 8px',
                                        backgroundColor: isActivePath(item.path)
                                            ? 'rgba(99, 102, 241, 0.1)'
                                            : 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                        }
                                    }}
                                >
                                    <Box sx={{ mr: 2, color: '#6366f1' }}>
                                        {item.icon}
                                    </Box>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};