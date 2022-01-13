import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import format from 'date-fns/format';

// React-datepicker use 00:00 time and TZ so without endOfDay, selected day will be yesterday
export const toEndOfDayUTCISO = (date: Date) => endOfDay(date).toISOString();

export const toStartOfDayUTCISO = (date: Date) => startOfDay(date).toISOString();

export const formatToFinnishDate = (date: string) => format(new Date(date), 'dd.MM.yyyy');

const ddmmyyyyRegex = /[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}/;

export const convertFinnishDate = (date: string) => {
  if (date.match(ddmmyyyyRegex)) {
    const dateSplit = date.split('.');
    const day = dateSplit[0];
    const month = dateSplit[1];
    const year = dateSplit[2];

    if (parseInt(day, 10) > 31 || parseInt(month, 10) > 12) return '';
    // allow users to type in both 1.1.2020 and 01.01.2020
    // and 1.10.2020 etc
    const selectedDate = new Date(
      ` ${year}-${month.length === 1 ? `0${month}` : month}-${day.length === 1 ? `0${day}` : day}`
    );
    return selectedDate.toString();
  }
  return '';
};
