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
  // Build a robust lang key. For areas we exclude the numeric index from the key
  // but we still want a usable areaName fallback if the area has no name set.
  const langKey = pathParts.reduce((acc, part, index) => {
    if (pathParts[0] === 'areas' && index === 1) {
      // Exclude the index from the lang key for areas
      return acc;
    }
    return `${acc}:${part}`;
  }, 'hakemus:missingFields');

  // Compute a safe areaName fallback when needed
  const areaIndex = pathParts[0] === 'areas' && pathParts[1] ? Number(pathParts[1]) : undefined;
  const rawAreaName =
    typeof areaIndex === 'number' && !Number.isNaN(areaIndex)
      ? formData.applicationData.areas?.[areaIndex]?.name
      : undefined;
  const areaName =
    rawAreaName || (typeof areaIndex === 'number' ? `Hankealue ${areaIndex + 1}` : undefined);

  // Handle special translation key variants used in fi.json for kaivuilmoitus start/end time
  let resolvedLangKey = langKey;
  if (pathParts[0] === 'startTime' && context === 'kaivuilmoitus') {
    resolvedLangKey = 'hakemus:missingFields:startTime_kaivuilmoitus';
  }
  if (pathParts[0] === 'endTime' && context === 'kaivuilmoitus') {
    resolvedLangKey = 'hakemus:missingFields:endTime_kaivuilmoitus';
  }

  // For registryKey translations we have context-specific translation keys like registryKey_person
  // or registryKey_muu in the locales; map those here instead of relying on i18next context.
  if (
    (pathParts[0] === 'customerWithContacts' || pathParts[0] === 'invoicingCustomer') &&
    pathParts[pathParts.length - 1] === 'registryKey'
  ) {
    if (context === 'person') {
      resolvedLangKey = `${resolvedLangKey}_person`;
    } else if (context === 'muu') {
      resolvedLangKey = `${resolvedLangKey}_muu`;
    }
  }

  // Temporary debug: log mapping decisions during tests to diagnose missing notification labels

  if (process.env.NODE_ENV === 'test')
    console.debug('mapValidationError', { errorPath, resolvedLangKey, pathParts });

  const linkText = t(resolvedLangKey, {
    count: areaIndex !== undefined && !Number.isNaN(areaIndex) ? areaIndex + 1 : undefined,
    areaName,
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
