import { zipWith } from 'lodash';

export default function isValidBusinessId(value: string | null | undefined): boolean {
  if (!value) return false;

  if (!/^\d{7}-\d$/.test(value)) return false;

  const runningNumber = value.substring(0, 7);
  const runningNumberArray = Array.from(runningNumber).map((char) => Number(char));
  const sum = zipWith(runningNumberArray, [7, 9, 10, 5, 8, 4, 2], (a, b) => a * b).reduce(
    (previous, current) => previous + current,
    0
  );
  const remainder = sum % 11;
  const check = Number(value[8]);
  const result = 11 - remainder;

  if (remainder === 1) return false;
  if ((remainder === 0 && check === 0) || result === check) return true;
  return false;
}
