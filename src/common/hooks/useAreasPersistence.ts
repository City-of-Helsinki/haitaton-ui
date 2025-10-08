import useFormLanguagePersistence from './useFormLanguagePersistence';
import { UseFormReturn } from 'react-hook-form';
import merge from 'lodash/merge';
import {
  buildJohtoAreasGeometrySnapshot,
  buildKaivuAreasGeometrySnapshot,
  hydrateJohtoAreasGeometryAfterHydrate,
  hydrateKaivuAreasGeometryAfterHydrate,
  FormContextLike,
} from '../../domain/common/utils/persistenceGeometry';

/**
 * Helper to create a persistence instance for forms that store areas geometry.
 * The hook abstracts the select/afterHydrate behavior used in Johto and Kaivu
 * containers so the logic isn't duplicated between them.
 */
export default function useAreasPersistence<T extends object = Record<string, unknown>>(
  key: string,
  formContext: UseFormReturn<T>,
  options?: { type?: 'JOHTO' | 'KAIVU'; extraSelect?: (values: T) => unknown },
) {
  const type = options?.type ?? 'JOHTO';

  return useFormLanguagePersistence(key, formContext, {
    select(values: T) {
      // values shape comes from react-hook-form; narrow to object with applicationData
      const valuesObj = values as unknown as
        | { applicationData?: Record<string, unknown> }
        | undefined;
      const ad = (valuesObj?.applicationData ?? {}) as Record<string, unknown>;

      const areas = ad.areas as unknown;
      const geometrySnapshot =
        type === 'JOHTO'
          ? buildJohtoAreasGeometrySnapshot(areas as Array<Record<string, unknown>> | undefined)
          : buildKaivuAreasGeometrySnapshot(areas as unknown as Array<unknown> | undefined);

      // Minimal persisted shape used by both containers
      const base: Record<string, unknown> = {
        applicationData: {
          name: ad.name,
          workDescription: ad.workDescription,
          constructionWork: ad.constructionWork,
          maintenanceWork: ad.maintenanceWork,
          emergencyWork: ad.emergencyWork,
          rockExcavation: ad.rockExcavation,
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
                registryKey: customer?.registryKey,
                registryKeyHidden: customer?.registryKeyHidden,
                email: customer?.email,
                phone: customer?.phone,
              },
              contacts: contacts.map((c: Record<string, unknown>) => ({
                firstName: c.firstName,
                lastName: c.lastName,
                email: c.email,
                phone: c.phone,
                orderer: c.orderer,
              })),
            };
          })(),
        },
        geometrySnapshot,
      };

      // Merge any caller-provided extra persisted data (Kaivu has many extra fields)
      const extra = options?.extraSelect ? options?.extraSelect(values) : undefined;
      if (extra && typeof extra === 'object') {
        return merge({}, base, extra);
      }

      // Johto-specific postalAddress persisted elsewhere; callers may override
      return base;
    },
    debounceMs: 250,
    afterHydrate(raw: unknown) {
      // formContext uses react-hook-form generics; cast to FormContextLike for compatibility
      const formCtx = formContext as unknown as FormContextLike;
      if (type === 'JOHTO') {
        hydrateJohtoAreasGeometryAfterHydrate(raw, formCtx, {
          pathPrefix: 'applicationData.areas',
          snapshotKey: 'areas',
        });
      } else {
        hydrateKaivuAreasGeometryAfterHydrate(raw, formCtx, {
          pathPrefix: 'applicationData.areas',
          snapshotKey: 'areas',
        });
      }
    },
  });
}
