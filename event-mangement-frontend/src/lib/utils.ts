import dayjs from 'dayjs';

export const formatDate = (date: string | Date): string => {
    return dayjs(date).format('DD.MM.YYYY HH:mm');
};

export const isEventUpcoming = (eventDate: string | Date): boolean => {
    return dayjs(eventDate).isAfter(dayjs());
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getEventStatusColor = (eventDate: string | Date) => {
    const now = dayjs();
    const eventTime = dayjs(eventDate);

    if (eventTime.isBefore(now)) {
        return 'error';
    } else if (eventTime.diff(now, 'day') <= 7) {
        return 'warning';
    } else {
        return 'success';
    }
};
