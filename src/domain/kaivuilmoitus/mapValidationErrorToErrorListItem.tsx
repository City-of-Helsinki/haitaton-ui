import { ValidationError } from 'yup';
import { TFunction } from 'i18next';
import { ContactType } from '../application/types/application';
import { Link } from 'hds-react';
import { KaivuilmoitusFormValues } from './types';
import { KaivuilmoitusTaydennysFormValues } from '../kaivuilmoitusTaydennys/types';

function getTranslationContextForContactType(
  contactType: keyof typeof ContactType | null | undefined,
) {
  if (contactType === 'PERSON') {
    return 'person';
  } else if (contactType === 'OTHER') {
    return 'muu';
  }
}

export function mapValidationErrorToErrorListItem(
  error: ValidationError,
  t: TFunction,
  formData: KaivuilmoitusFormValues | KaivuilmoitusTaydennysFormValues,
) {
  const errorPath = error.path?.replace('[', '.').replace(']', '');
  const pathParts = errorPath?.match(/(\w+)/g)?.filter((part) => part !== 'applicationData') || [];

  if (pathParts.length === 1 && pathParts[0] === 'areas') {
    pathParts[0] = 'areas.empty';
  }

  let context;
  if (pathParts[0] === 'customerWithContacts') {
    context = getTranslationContextForContactType(
      formData.applicationData.customerWithContacts?.customer.type,
    );
  }
  if (pathParts[0] === 'invoicingCustomer') {
    context = getTranslationContextForContactType(formData.applicationData.invoicingCustomer?.type);
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
    areaName: formData.applicationData.areas[Number(pathParts[1])]?.name,
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
