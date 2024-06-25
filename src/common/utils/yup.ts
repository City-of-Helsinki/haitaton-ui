import * as yup from 'yup';
import { formatToFinnishDate } from './date';
import isValidBusinessId from '../../common/utils/isValidBusinessId';
import { HankeUser } from '../../domain/hanke/hankeUsers/hankeUser';

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
    email: { key: 'email', values: {} },
  },
  date: {
    min: ({ min }: { min: string | Date }) => ({
      key: 'dateMin',
      values: { min: formatToFinnishDate(min) },
    }),
    max: ({ max }: { max: string | Date }) => ({
      key: 'dateMax',
      values: { max: formatToFinnishDate(max) },
    }),
  },
});

yup.addMethod(
  yup.string,
  'phone',
  function isValidPhoneNumber(message: yup.Message = { key: 'phone', values: {} }) {
    return this.matches(/^(\+?)(\d+)$/, { message: () => message, excludeEmptyString: true });
  },
);

yup.addMethod(
  yup.string,
  'businessId',
  function validBusinessId(message: yup.Message = { key: 'default', values: {} }) {
    return this.test('is-business-id', message, isValidBusinessId);
  },
);

yup.addMethod(yup.string, 'uniqueEmail', function isUniqueEmail() {
  return this.test('uniqueEmail', 'Email already exists', function (value) {
    const context = this.options.context;
    if (!context) {
      return true;
    }
    const { hankeUsers, currentUser, errorMessageKey } = context as {
      hankeUsers: HankeUser[];
      currentUser?: HankeUser;
      errorMessageKey: string;
    };
    if (!hankeUsers) {
      return true;
    }
    const isUnique =
      !hankeUsers.some((user) => user.sahkoposti === value) || currentUser?.sahkoposti === value;
    return (
      isUnique ||
      this.createError({ path: this.path, message: { key: errorMessageKey, values: {} } })
    );
  });
});

export default yup;
