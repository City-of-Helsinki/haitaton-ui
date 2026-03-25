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

function resolveContext(
  pathParts: string[],
  formData: KaivuilmoitusFormValues | KaivuilmoitusTaydennysFormValues,
): string | undefined {
  if (pathParts[0] === 'customerWithContacts') {
    return getTranslationContextForContactType(
      formData.applicationData.customerWithContacts?.customer.type,
    );
  }
  if (pathParts[0] === 'invoicingCustomer') {
    return getTranslationContextForContactType(formData.applicationData.invoicingCustomer?.type);
  }
  if (pathParts[0] === 'startTime' || pathParts[0] === 'endTime') {
    return 'kaivuilmoitus';
  }
  return undefined;
}

function buildLangKey(pathParts: string[]): string {
  return pathParts.reduce((acc, part, index) => {
    if (pathParts[0] === 'areas' && index === 1) {
      return acc;
    }
    return `${acc}:${part}`;
  }, 'hakemus:missingFields');
}

function applyLangKeyOverrides(
  langKey: string,
  pathParts: string[],
  context: string | undefined,
): string {
  if (pathParts[0] === 'startTime' && context === 'kaivuilmoitus') {
    return 'hakemus:missingFields:startTime_kaivuilmoitus';
  }
  if (pathParts[0] === 'endTime' && context === 'kaivuilmoitus') {
    return 'hakemus:missingFields:endTime_kaivuilmoitus';
  }
  if (
    (pathParts[0] === 'customerWithContacts' || pathParts[0] === 'invoicingCustomer') &&
    pathParts.at(-1) === 'registryKey'
  ) {
    if (context === 'person') return `${langKey}_person`;
    if (context === 'muu') return `${langKey}_muu`;
  }
  return langKey;
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

  const context = resolveContext(pathParts, formData);
  const langKey = buildLangKey(pathParts);

  // Compute a safe areaName fallback when needed
  const areaIndex = pathParts[0] === 'areas' && pathParts[1] ? Number(pathParts[1]) : undefined;
  const rawAreaName =
    typeof areaIndex === 'number' && !Number.isNaN(areaIndex)
      ? formData.applicationData.areas?.[areaIndex]?.name
      : undefined;
  const areaName =
    rawAreaName || (typeof areaIndex === 'number' ? `Hankealue ${areaIndex + 1}` : undefined);

  const resolvedLangKey = applyLangKeyOverrides(langKey, pathParts, context);

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
