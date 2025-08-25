import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#dc004e',
            light: '#ff5983',
            dark: '#9a0036',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#212121',
            secondary: '#616161',
        },
    },
    typography: {
        h4: {
            fontWeight: 600,
            marginBottom: '1rem',
        },
        h5: {
            fontWeight: 500,
            marginBottom: '0.5rem',
        },
        h6: {
            fontWeight: 500,
        },
        body1: {
            lineHeight: 1.6,
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px 16px 0 0',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                    transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 20px',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd6 0%, #693f95 100%)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#666 !important',
                    '&.Mui-focused': {
                        color: '#1976d2 !important',
                    },
                },
            },
        },
    },
});
