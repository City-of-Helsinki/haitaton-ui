import { FieldPath, UseFormGetValues } from 'react-hook-form';
import { ValidationError } from 'yup';
import { useTranslation } from 'react-i18next';
import { Link, Notification } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { HankeDataFormState } from '../types';

type Props = {
  formErrors: ValidationError[];
  getValues: UseFormGetValues<HankeDataFormState>;
  notificationLabelKey?: string;
};

export default function HankeFormMissingFieldsNotification({
  formErrors,
  getValues,
  notificationLabelKey = 'hankePortfolio:draftState:labels:missingFields',
}: Readonly<Props>) {
  const { t } = useTranslation();

  function mapToErrorListItem(error: ValidationError) {
    const errorPath = error.path?.replace('[', '.').replace(']', '');
    // Get parts of the path: for example for path 'alueet.0.meluHaitta' returns ['alueet', '0', 'meluHaitta'],
    // and for example for 'alueet' just ['alueet']
    const pathParts = errorPath?.match(/(\w+)/g) || [];

    if (pathParts.length === 1 && pathParts[0] === 'alueet') {
      pathParts[0] = 'alueet.empty';
    }

    const langKey = pathParts.reduce((acc, part, index) => {
      if (index === 1) {
        // Exclude the index from the lang key
        return acc;
      }
      return `${acc}:${part}`;
    }, 'hankeForm:missingFields');

    const linkText = t(langKey, {
      count: Number(pathParts[1]) + 1,
      alueName: getValues(`alueet.${pathParts[1]}.nimi` as FieldPath<HankeDataFormState>),
    });

    return (
      <li key={errorPath}>
        <Link href={`#${errorPath}`} disableVisitedStyles>
          {linkText}
        </Link>
      </li>
    );
  }

  return (
    <Notification label={t(notificationLabelKey)} type="alert">
      <Box as="ul" marginLeft="var(--spacing-m)">
        {formErrors.map(mapToErrorListItem)}
      </Box>
    </Notification>
  );
}
