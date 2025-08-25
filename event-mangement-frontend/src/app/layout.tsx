'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from '@/lib/theme';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NotificationProvider } from '@/context/NotificationContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="uk">
        <body className={inter.className}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NotificationProvider>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundAttachment: 'fixed',
                }}>
                    <Header />
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            py: { xs: 2, sm: 3 },
                            px: { xs: 1, sm: 2 },
                            mb: 4,
                        }}
                    >
                        {children}
                    </Box>
                    <Footer />
                </Box>
            </NotificationProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}