import useFormLanguagePersistence from './useFormLanguagePersistence';
import { mapToKaivuilmoitusArea } from '../../domain/kaivuilmoitus/utils';
import { mapToJohtoselvitysArea } from '../../domain/johtoselvitys/utils';
import { KaivuilmoitusAlue, ApplicationArea } from '../../domain/application/types/application';
import { normalizeStringEmptyToNull } from '../utils/normalize';
import { UseFormReturn } from 'react-hook-form';
import merge from 'lodash/merge';

type SetValueFn = (path: string, value: unknown, opts?: { shouldDirty?: boolean }) => void;

function reconstructArea(a: Record<string, unknown>, appType: string | undefined) {
  if (appType === 'CABLE_REPORT') {
    try {
      return mapToJohtoselvitysArea(a as ApplicationArea);
    } catch {
      // fall back to kaivu mapper
    }
  }
  return mapToKaivuilmoitusArea(a as KaivuilmoitusAlue);
}

function hydrateFormAreas(
  setValue: SetValueFn,
  appData: Record<string, unknown>,
  persistedApp: Record<string, unknown>,
) {
  const areasRaw = Array.isArray(appData.areas)
    ? (appData.areas as Array<Record<string, unknown>>)
    : undefined;
  const appType =
    (persistedApp.applicationType as string | undefined) ??
    (appData.applicationType as string | undefined);
  if (areasRaw) {
    const updatedAreas = areasRaw.map((a) => reconstructArea(a, appType));
    setValue('applicationData.areas', updatedAreas, { shouldDirty: false });
  }
  if (persistedApp.id !== undefined) setValue('id', persistedApp.id, { shouldDirty: false });
  if (persistedApp.alluStatus !== undefined)
    setValue('alluStatus', persistedApp.alluStatus, { shouldDirty: false });
  if (persistedApp.applicationType !== undefined)
    setValue('applicationType', persistedApp.applicationType, { shouldDirty: false });
}

/**
 * Helper to create a persistence instance for forms that store areas geometry.
 * The hook abstracts the select/afterHydrate behavior used in Johto and Kaivu
 * containers so the logic isn't duplicated between them.
 */
export type AreasPersistenceOptions<T> =
  | { type?: 'JOHTO' | 'KAIVU'; extraSelect?: (values: T) => unknown }
  | { persistAsApiModel?: true; buildApiModel?: (values: T) => unknown };

export default function useAreasPersistence<T extends object = Record<string, unknown>>(
  key: string,
  formContext: UseFormReturn<T>,
  options?: AreasPersistenceOptions<T>,
) {
  const persistAsApiModel = Boolean(
    options && 'persistAsApiModel' in options && options.persistAsApiModel,
  );
  const buildApiModel = options && 'buildApiModel' in options ? options.buildApiModel : undefined;

  function sanitizeForPersistence(obj: unknown): unknown {
    // Recursively remove non-serializable bits (openlayersFeature, Feature instances)
    // and convert Dates to ISO strings.
    if (obj === null || obj === undefined) return obj;
    if (obj instanceof Date) return obj.toISOString();
    if (Array.isArray(obj)) return obj.map((v) => sanitizeForPersistence(v));
    if (typeof obj !== 'object') return obj;
    const plain: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (k === 'openlayersFeature' || k === 'feature') continue;
      // skip functions and symbols
      if (typeof v === 'function' || typeof v === 'symbol') continue;
      plain[k] = sanitizeForPersistence(v);
    }
    return plain;
  }

  return useFormLanguagePersistence(key, formContext, {
    // Use 'effect' phase so that hydration fires after useFieldArray's _subjects.array
    // subscription (registered via useEffect in children) is active. With 'layout' the
    // setValue('applicationData.areas', ...) call inside afterHydrate fires before
    // useFieldArray's subscription is set up, so the fields array never updates.
    hydratePhase: 'effect',
    select(values: T) {
      if (persistAsApiModel) {
        try {
          const built = buildApiModel
            ? buildApiModel(values)
            : (() => {
                const valuesObj = values as { id?: unknown; alluStatus?: unknown } | undefined;
                const applicationData = (
                  values as unknown as { applicationData: Record<string, unknown> | undefined }
                ).applicationData;
                return {
                  id: valuesObj?.id ?? null,
                  alluStatus: valuesObj?.alluStatus ?? null,
                  applicationType:
                    (applicationData as Record<string, unknown> | undefined)?.applicationType ??
                    'EXCAVATION_NOTIFICATION',
                  applicationData: applicationData ?? {},
                };
              })();
          const sanitized = sanitizeForPersistence(built);
          if (sanitized) return sanitized;
        } catch {
          // fall through to fallback
        }
        // fallback: persist a lightweight but richer applicationData subset to ensure tests and UI work
        try {
          type WithAppData = { applicationData?: Record<string, unknown> } | undefined;
          const valuesObj = values as WithAppData;
          const ad = (valuesObj?.applicationData ?? {}) as Record<string, unknown>;
          const fallback = {
            id: (values as unknown as { id?: unknown })?.id ?? null,
            alluStatus: (values as unknown as { alluStatus?: unknown })?.alluStatus ?? null,
            applicationType: ad.applicationType ?? 'EXCAVATION_NOTIFICATION',
            applicationData: {
              ...ad,
              additionalInfo: ad.additionalInfo,
              customerWithContacts: ad.customerWithContacts,
              contractorWithContacts: ad.contractorWithContacts,
              representativeWithContacts: ad.representativeWithContacts,
              propertyDeveloperWithContacts: ad.propertyDeveloperWithContacts,
              invoicingCustomer: ad.invoicingCustomer,
            },
          };
          return sanitizeForPersistence(fallback);
        } catch {
          return undefined;
        }
      }

      const valuesObj = values as { applicationData?: Record<string, unknown> } | undefined;
      const ad = (valuesObj?.applicationData ?? {}) as Record<string, unknown>;

      const base: Record<string, unknown> = {
        applicationData: {
          name: ad.name,
          workDescription: ad.workDescription,
          constructionWork: ad.constructionWork,
          maintenanceWork: ad.maintenanceWork,
          emergencyWork: ad.emergencyWork,
          rockExcavation: ad.rockExcavation,
          cableReportDone: ad.cableReportDone,
          startTime: ad.startTime,
          endTime: ad.endTime,
          customerWithContacts: (() => {
            const cwc = ad.customerWithContacts as Record<string, unknown> | undefined;
            if (!cwc) return cwc;
            const customer = cwc.customer as Record<string, unknown> | undefined;
            const contacts = (cwc.contacts as Array<Record<string, unknown>> | undefined) ?? [];
            return {
              customer: {
                type: customer?.type,
                name: customer?.name,
                registryKey: normalizeStringEmptyToNull(
                  customer?.registryKey as string | null | undefined,
                ),
                registryKeyHidden: customer?.registryKeyHidden,
                email: customer?.email,
                phone: customer?.phone,
              },
              contacts: contacts.map((c: Record<string, unknown>) => ({
                hankekayttajaId: (c as { hankekayttajaId?: string }).hankekayttajaId,
                firstName: c.firstName,
                lastName: c.lastName,
                email: c.email,
                phone: c.phone,
                orderer: c.orderer,
              })),
            };
          })(),
        },
      };

      let extra: unknown;
      // type guard: check if options contains extraSelect
      if (options && 'extraSelect' in options) {
        const opt = options as { extraSelect?: (values: T) => unknown };
        if (typeof opt.extraSelect === 'function') {
          extra = opt.extraSelect(values);
        }
      }
      if (extra && typeof extra === 'object') {
        return merge({}, base, extra);
      }

      return base;
    },
    debounceMs: 250,
    afterHydrate(raw: unknown) {
      try {
        if (!raw || typeof raw !== 'object') return;
        const persistedApp = raw as Record<string, unknown>;
        if (!persistedApp.applicationData) return;
        const appData = persistedApp.applicationData as Record<string, unknown>;
        // setValue is typed on the generic form context; cast once to access it
        const setValue = (formContext as unknown as { setValue: SetValueFn }).setValue;
        hydrateFormAreas(setValue, appData, persistedApp);
      } catch {
        // ignore
      }
    },
  });
}
