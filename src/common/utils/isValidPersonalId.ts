import { isValid, parse } from 'date-fns';

const hetuRegex =
  /^(?<day>\d{2})(?<month>\d{2})(?<year>\d{2})(?<separator>[-+U-YA-F])(?<index>\d{3})(?<checkDigit>[\dA-FHJ-NPR-Y])$/;
const eighteens = ['+'];
const nineteens = ['-', 'U', 'V', 'W', 'X', 'Y'];
const twenties = ['A', 'B', 'C', 'D', 'E', 'F'];
const checkDigits = '0123456789ABCDEFHJKLMNPRSTUVWXY'.split('');

function isValidDate(day: string, month: string, year: string, century: number): boolean {
  try {
    const fullDate = `${century}${year}-${month}-${day}`;
    const parsedDate = parse(fullDate, 'yyyy-MM-dd', new Date());

    return isValid(parsedDate) && parsedDate > new Date('1850-01-01') && parsedDate < new Date();
  } catch (e) {
    return false;
  }
}

function isValidCheckDigit(parts: string, checkDigit: string): boolean {
  const index = parseInt(parts, 10) % 31;
  return checkDigits[index] === checkDigit;
}

function toCentury(separator: string): number | null {
  if (eighteens.includes(separator)) return 18;
  if (nineteens.includes(separator)) return 19;
  if (twenties.includes(separator)) return 20;
  return null; // Invalid separator
}

export default function isValidPersonalId(value: string | null | undefined): boolean {
  if (value === null || value === '') return true;
  if (value === undefined) return false;

  const match = hetuRegex.exec(value.toUpperCase());
  if (!match || !match.groups) {
    return false;
  }

  const { day, month, year, separator, index, checkDigit } = match.groups;

  const century = toCentury(separator);
  if (century === null) {
    return false;
  }

  if (!isValidDate(day, month, year, century)) {
    return false;
  }

  if (!isValidCheckDigit(`${day}${month}${year}${index}`, checkDigit)) {
    return false;
  }

  return true;
}
