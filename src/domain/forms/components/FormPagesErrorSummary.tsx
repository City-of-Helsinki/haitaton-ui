import { Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { uniq } from 'lodash';
import { $enum } from 'ts-enum-util';
import { AnyObject, ObjectSchema, SchemaDescription, reach } from 'yup';
import { useValidationErrors } from '../hooks/useValidationErrors';
import { FORM_PAGES } from '../types';

const pageOrder = $enum(FORM_PAGES).getValues();

function sortPages(a: string, b: string) {
  return pageOrder.indexOf(a as FORM_PAGES) - pageOrder.indexOf(b as FORM_PAGES);
}

type Props<T> = {
  data: T;
  schema: ObjectSchema<AnyObject>;
  validationContext?: AnyObject;
  notificationLabel: string;
  /** Additional class names to apply to the notification */
  className?: string;
  testId?: string;
};

/**
 * Displays a list of form pages that have validation errors
 */
export default function FormPagesErrorSummary<T>({
  data,
  schema,
  validationContext,
  notificationLabel,
  className,
  testId,
}: Readonly<Props<T>>) {
  const { t } = useTranslation();
  const validationErrors = useValidationErrors(schema, data, validationContext);
  const schemasWithErrors = validationErrors.map(
    (error) => reach(schema, error.path as string).describe() as SchemaDescription,
  );
  const errorPages = uniq(
    schemasWithErrors.flatMap((error) => error.meta?.pageName || []),
  ).toSorted(sortPages);

  if (errorPages.length > 0) {
    return (
      <Notification
        label={notificationLabel}
        className={className}
        type="alert"
        data-testid={testId}
      >
        <Box as="ul" marginLeft="var(--spacing-m)">
          {errorPages.map((page) => {
            return (
              <li key={page} aria-label={t(`form:headers:${page}`)}>
                {t(`form:headers:${page}`)}
              </li>
            );
          })}
        </Box>
      </Notification>
    );
  }

  return null;
}
