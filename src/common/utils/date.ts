import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import format from 'date-fns/format';

// React-datepicker use 00:00 time and TZ so without endOfDay, selected day will be yesterday
export const toEndOfDayUTCISO = (date: Date) => endOfDay(date).toISOString();

export const toStartOfDayUTCISO = (date: Date) => startOfDay(date).toISOString();

export const formatToFinnishDate = (date: string) => format(new Date(date), 'dd.MM.yyyy');
