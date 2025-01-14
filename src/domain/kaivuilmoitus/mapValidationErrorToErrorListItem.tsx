import { FieldPath, FieldValues, UseFormGetValues } from 'react-hook-form';
import { ValidationError } from 'yup';
import { TFunction } from 'i18next';
import { ContactType } from '../application/types/application';
import { Link } from 'hds-react';

function getTranslationContextForContactType(contactType: keyof typeof ContactType | null) {
  if (contactType === 'PERSON') {
    return 'person';
  } else if (contactType === 'OTHER') {
    return 'muu';
  }
}

export function mapValidationErrorToErrorListItem<T extends FieldValues>(
  error: ValidationError,
  t: TFunction,
  getValues: UseFormGetValues<T>,
) {
  const errorPath = error.path?.replace('[', '.').replace(']', '');
  const pathParts = errorPath?.match(/(\w+)/g)?.filter((part) => part !== 'applicationData') || [];

  if (pathParts.length === 1 && pathParts[0] === 'areas') {
    pathParts[0] = 'areas.empty';
  }

  let context;
  if (pathParts[0] === 'customerWithContacts') {
    context = getTranslationContextForContactType(
      getValues('applicationData.customerWithContacts.customer.type' as FieldPath<T>),
    );
  }
  if (pathParts[0] === 'invoicingCustomer') {
    context = getTranslationContextForContactType(
      getValues('applicationData.invoicingCustomer.type' as FieldPath<T>),
    );
  }
  if (pathParts[0] === 'startTime') {
    context = 'kaivuilmoitus';
  }
  if (pathParts[0] === 'endTime') {
    context = 'kaivuilmoitus';
  }

  const langKey = pathParts.reduce((acc, part, index) => {
    if (pathParts[0] === 'areas' && index === 1) {
      // Exclude the index from the lang key for areas
      return acc;
    }
    return `${acc}:${part}`;
  }, 'hakemus:missingFields');

  const linkText = t(langKey, {
    count: Number(pathParts[1]) + 1,
    areaName: getValues(`applicationData.areas.${pathParts[1]}.name` as FieldPath<T>),
    context,
  });

  return (
    <li key={errorPath}>
      <Link href={`#${errorPath}`} disableVisitedStyles>
        {linkText}
      </Link>
    </li>
  );
}
