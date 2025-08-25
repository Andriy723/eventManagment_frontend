import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';

interface DeleteDialogProps {
    open: boolean;
    title: string;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export const DeleteDialog = ({ open, title, onClose, onConfirm, loading = false }: DeleteDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Підтвердження видалення</DialogTitle>
            <DialogContent>
                <Typography>
                    Ви дійсно хочете видалити подію "{title}"?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Цю дію неможливо буде скасувати.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Скасувати
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
                    {loading ? 'Видалення...' : 'Видалити'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};