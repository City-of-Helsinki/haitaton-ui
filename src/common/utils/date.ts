import endOfDay from 'date-fns/endOfDay';

// React-datepicker use 00:00 time and TZ so without endOfDay, selected day will be yesterday
export const toEndOfDayUTCISO = (date: Date) => endOfDay(date).toISOString();
