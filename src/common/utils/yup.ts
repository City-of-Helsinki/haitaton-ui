import * as yup from 'yup';
import { formatToFinnishDate } from './date';

// https://github.com/jquense/yup/blob/master/src/locale.ts
yup.setLocale({
  mixed: {
    default: { key: 'default', values: {} },
    required: { key: 'required', values: {} },
    defined: { key: 'defined', values: {} },
    notType: { key: 'notType', values: {} },
  },
  string: {
    min: ({ min }: { min: number }) => ({ key: 'stringMin', values: { min } }),
    max: ({ max }: { max: number }) => ({ key: 'stringMax', values: { max } }),
    dropdown: ({ min }: { min: number }) => ({ key: 'dropdown', values: { min } }),
  },
  date: {
    min: ({ min }: { min: string }) => ({
      key: 'dateMin',
      values: { min: formatToFinnishDate(min) },
    }),
    max: ({ max }: { max: string }) => ({
      key: 'dateMax',
      values: { max: formatToFinnishDate(max) },
    }),
  },
});

export default yup;
