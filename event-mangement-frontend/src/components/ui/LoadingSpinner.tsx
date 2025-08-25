import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
    message?: string;
    size?: number;
}

export const LoadingSpinner = ({ message = 'Завантаження...', size = 40 }: LoadingSpinnerProps) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
            gap={2}
        >
            <CircularProgress size={size} />
            <Typography variant="body2" color="#ffffff">
                {message}
            </Typography>
        </Box>
    );
};