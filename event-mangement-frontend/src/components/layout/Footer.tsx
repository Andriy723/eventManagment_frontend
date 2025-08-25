import {
    Box,
    Typography,
    Container,
    Grid,
    Link,
    IconButton,
    Divider,
    Avatar,
} from '@mui/material';
import {
    EmailOutlined,
    PhoneOutlined,
    LocationOnOutlined,
    FacebookOutlined,
    Twitter,
    Instagram,
    LinkedIn,
    HelpOutlineOutlined,
    SecurityOutlined,
    FavoriteOutlined
} from '@mui/icons-material';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: 'Про нас', href: '/about' },
            { label: 'Наша команда', href: '/team' },
            { label: 'Блог', href: '/blog' },
            { label: 'Новини', href: '/news' }
        ],
        support: [
            { label: 'Допомога', href: '/help', icon: <HelpOutlineOutlined fontSize="small" /> },
            { label: 'FAQ', href: '/faq' },
            { label: 'Контакти', href: '/contact' },
            { label: 'Тех. підтримка', href: '/support' }
        ],
        legal: [
            { label: 'Політика конфіденційності', href: '/privacy', icon: <SecurityOutlined fontSize="small" /> },
            { label: 'Умови використання', href: '/terms' },
            { label: 'Правила сайту', href: '/rules' },
            { label: 'Cookies', href: '/cookies' }
        ]
    };

    const socialLinks = [
        { icon: <FacebookOutlined />, href: 'https://facebook.com', label: 'Facebook', color: '#1877F2' },
        { icon: <Twitter />, href: 'https://twitter.com', label: 'Twitter', color: '#1DA1F2' },
        { icon: <LinkedIn />, href: 'https://linkedin.com', label: 'LinkedIn', color: '#0A66C2' },
        { icon: <Instagram />, href: 'https://instagram.com', label: 'Instagram', color: '#E4405F' }
    ];

    const stats = [
        { number: '40+', label: 'Активних подій', color: '#48bb78' },
        { number: '2K+', label: 'Користувачів', color: '#667eea' },
        { number: '5+', label: 'Міст України', color: '#ed8936' },
        { number: '24/7', label: 'Підтримка', color: '#f56565' }
    ];

    return (
        <Box
            component="footer"
            sx={{
                background: 'rgba(45, 55, 72, 0.95)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                mt: 'auto',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mb: 3 }}>
                            <Box display="flex" alignItems="center" mb={3}>
                                <Avatar
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        mr: 2,
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    E
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            color: 'transparent',
                                        }}
                                    >
                                        EventHub
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Керування подіями
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="body2" sx={{ mb: 3, opacity: 0.9, maxWidth: 300, lineHeight: 1.6 }}>
                                Провідна система керування подіями в Україні. Створюйте незабутні моменти разом з нами.
                            </Typography>

                            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box display="flex" alignItems="center">
                                    <EmailOutlined sx={{ mr: 2, fontSize: 18, color: '#667eea' }} />
                                    <Typography variant="body2">
                                        hello@eventhub.ua
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <PhoneOutlined sx={{ mr: 2, fontSize: 18, color: '#667eea' }} />
                                    <Typography variant="body2">
                                        +38 (044) 123-45-67
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <LocationOnOutlined sx={{ mr: 2, fontSize: 18, color: '#e53e3e' }} />
                                    <Typography variant="body2">
                                        Львів, Україна
                                    </Typography>
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                    Слідкуйте за нами:
                                </Typography>
                                <Box display="flex" gap={1}>
                                    {socialLinks.map((social) => (
                                        <IconButton
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                color: 'white',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                '&:hover': {
                                                    background: social.color,
                                                    transform: 'translateY(-2px) scale(1.05)',
                                                    boxShadow: `0 4px 20px ${social.color}40`,
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {social.icon}
                                        </IconButton>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#667eea' }}>
                            Компанія
                        </Typography>
                        <Box component="nav" display="flex" flexDirection="column" gap={1.5}>
                            {footerLinks.company.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: '#667eea',
                                            transform: 'translateX(4px)',
                                        },
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#667eea' }}>
                            Підтримка
                        </Typography>
                        <Box component="nav" display="flex" flexDirection="column" gap={1.5}>
                            {footerLinks.support.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'rgba(255,255,255,0.8)',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: '#667eea',
                                            transform: 'translateX(4px)',
                                        },
                                    }}
                                >
                                    {link.icon && <Box sx={{ mr: 1, color: '#667eea' }}>{link.icon}</Box>}
                                    {link.label}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={12} md={3}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#667eea' }}>
                            Правова інформація
                        </Typography>
                        <Box component="nav" display="flex" flexDirection="column" gap={1.5}>
                            {footerLinks.legal.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'rgba(255,255,255,0.8)',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: '#667eea',
                                            transform: 'translateX(4px)',
                                        },
                                    }}
                                >
                                    {link.icon && <Box sx={{ mr: 1, color: '#667eea' }}>{link.icon}</Box>}
                                    {link.label}
                                </Link>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.15)' }} />

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {stats.map((stat, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                            <Box
                                textAlign="center"
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    sx={{
                                        color: stat.color,
                                        mb: 0.5,
                                        textShadow: `0 0 20px ${stat.color}40`
                                    }}
                                >
                                    {stat.number}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>
                                    {stat.label}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.15)' }} />
            </Container>

            <Box sx={{
                bgcolor: 'rgba(0,0,0,0.2)',
                py: 3,
                borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
                <Container maxWidth="xl">
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        gap={2}
                    >
                        <Typography variant="body2" sx={{ opacity: 0.7, textAlign: { xs: 'center', sm: 'left' } }}>
                            © {currentYear} EventHub. Всі права захищені.
                            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ml: 1 }}>
                                Зроблено з <FavoriteOutlined sx={{ fontSize: 16, mx: 0.5, color: 'red' }} /> в Україні
                            </Box>
                        </Typography>

                    </Box>
                </Container>
            </Box>
        </Box>
    );
};