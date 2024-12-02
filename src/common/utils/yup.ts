import * as yup from 'yup';
import { formatToFinnishDate } from './date';
import isValidBusinessId from '../../common/utils/isValidBusinessId';
import { HankeUser } from '../../domain/hanke/hankeUsers/hankeUser';
import { HAITTOJENHALLINTATYYPPI } from '../../domain/types/hanke';
import { HankeDataFormState } from '../../domain/hanke/edit/types';
import { Application } from '../../domain/application/types/application';
import { format } from 'date-fns/format';
import { fi } from 'date-fns/locale';
import isValidPersonalId from './isValidPersonalId';

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

yup.addMethod(
  yup.string,
  'personalId',
  function validPersonalId(message: yup.Message = { key: 'default', values: {} }) {
    return this.test('is-personal-id', message, isValidPersonalId);
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

yup.addMethod(
  yup.string,
  'detectedTrafficNuisance',
  function isDetectedNuisance(type: HAITTOJENHALLINTATYYPPI) {
    return this.test(
      'detectedTrafficNuisance',
      'Traffic nuisance is not detected',
      function (value) {
        const context = this.options.context;
        if (!context) {
          return true;
        }
        const { hanke } = context as {
          hanke: HankeDataFormState;
        };
        // Retrieve the correct area from hanke
        const hankeAlueet = hanke.alueet;
        const pathSegments: string[] = this.path.split('.');
        const hankeAluePathSegment = pathSegments.length > 0 ? pathSegments[0] : '';
        const match = hankeAluePathSegment.match(/\[(\d+)]/);
        let hankeAlueIndex = 0;
        if (match) {
          hankeAlueIndex = parseInt(match[1], 10);
        }
        if (!hankeAlueet || isNaN(hankeAlueIndex) || !hankeAlueet[hankeAlueIndex]) {
          return true;
        }
        const hankeAlue = hankeAlueet[hankeAlueIndex];

        const tormaystarkasteluTulos = hankeAlue?.tormaystarkasteluTulos;
        if (!tormaystarkasteluTulos) {
          return true;
        }

        const index = (() => {
          switch (type) {
            case HAITTOJENHALLINTATYYPPI.PYORALIIKENNE:
              return tormaystarkasteluTulos.pyoraliikenneindeksi;
            case HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE:
              return tormaystarkasteluTulos.autoliikenne.indeksi;
            case HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE:
              return tormaystarkasteluTulos.raitioliikenneindeksi;
            case HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE:
              return tormaystarkasteluTulos.linjaautoliikenneindeksi;
            default:
              return 0;
          }
        })();

        // If index > 0, the field is required
        if (index > 0) {
          if (!value) {
            return this.createError({
              path: this.path,
              message: {
                key: 'required',
                values: {},
              },
            });
          }
          return true;
        }

        // If index is 0, the field is not required
        return true;
      },
    );
  },
);

yup.addMethod(yup.date, 'validCompletionDate', function isValidCompletionDate() {
  return this.test('validCompletionDate', 'Invalid date', function (value) {
    if (!value) {
      return true;
    }
    const context = this.options.context;
    if (!context) {
      return true;
    }
    const { application, dateBeforeStartErrorMessageKey, dateInFutureErrorMessageKey } =
      context as {
        application: Application;
        dateBeforeStartErrorMessageKey: string;
        dateInFutureErrorMessageKey: string;
      };
    if (!application) {
      return true;
    }
    if (!application.applicationData.startTime) {
      return true;
    }
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    const startDate = new Date(application.applicationData.startTime);
    startDate.setHours(0, 0, 0, 0);
    let isValid = date >= startDate;
    if (!isValid) {
      return this.createError({
        path: this.path,
        message: {
          key: dateBeforeStartErrorMessageKey,
          values: {
            startDate: format(startDate, 'd.M.yyyy', { locale: fi }),
          },
        },
      });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    isValid = date <= today;
    return (
      isValid ||
      this.createError({
        path: this.path,
        message: { key: dateInFutureErrorMessageKey, values: {} },
      })
    );
  });
});

export default yup;
