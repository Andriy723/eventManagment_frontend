import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { RefreshOutlined } from '@mui/icons-material';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
    return (
        <Box sx={{ my: 2 }}>
            <Alert severity="error">
                <AlertTitle>Помилка</AlertTitle>
                {message}
                {onRetry && (
                    <Box sx={{ mt: 1 }}>
                        <Button
                            size="small"
                            startIcon={<RefreshOutlined />}
                            onClick={onRetry}
                            variant="outlined"
                            color="inherit"
                        >
                            Спробувати знову
                        </Button>
                    </Box>
                )}
            </Alert>
        </Box>
    );
};