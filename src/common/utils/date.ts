import { endOfDay } from 'date-fns/endOfDay';
import { startOfDay } from 'date-fns/startOfDay';
import { format } from 'date-fns/format';
import { fi } from 'date-fns/locale';

export const toEndOfDayUTCISO = (date: Date) => {
  try {
    return endOfDay(date).toISOString();
  } catch (error) {
    return '';
  }
};

export const toStartOfDayUTCISO = (date: Date) => {
  try {
    return startOfDay(date).toISOString();
  } catch (error) {
    return '';
  }
};

export const formatToFinnishDate = (date: string | Date | null) => {
  if (!date) {
    return undefined;
  }

  try {
    return format(new Date(date), 'd.M.yyyy', { locale: fi });
  } catch (error) {
    return undefined;
  }
};

export const formatToFinnishDateTime = (date: string | Date | null) => {
  if (!date) {
    return undefined;
  }

  try {
    return format(new Date(date), 'd.M.yyyy HH:mm', { locale: fi });
  } catch (error) {
    return undefined;
  }
};

const ddmmyyyyRegex = /[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}/;

export const convertFinnishDate = (date: string) => {
  if (date.match(ddmmyyyyRegex)) {
    const dateSplit = date.split('.');
    const day = dateSplit[0];
    const month = dateSplit[1];
    const year = dateSplit[2];

    if (parseInt(day, 10) > 31 || parseInt(month, 10) > 12) {
      return '';
    }

    const selectedDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    return selectedDate.toString();
  }

  return '';
};
