import { useCallback } from 'react';
import { HankeAlue } from '../../types/hanke';
import { areDatesWithinInterval } from '../../map/utils';
import { toStartOfDayUTCISO, toEndOfDayUTCISO } from '../../../common/utils/date';

export default function useFilterHankeAlueetByApplicationDates({
  applicationStartDate,
  applicationEndDate,
}: {
  applicationStartDate: Date | null;
  applicationEndDate: Date | null;
}) {
  return useCallback(
    (alueet: HankeAlue[]) => {
      return alueet.filter((alue) =>
        areDatesWithinInterval({
          start: alue.haittaAlkuPvm && toStartOfDayUTCISO(alue.haittaAlkuPvm),
          end: alue.haittaLoppuPvm && toEndOfDayUTCISO(alue.haittaLoppuPvm),
        })({
          start: applicationStartDate && toStartOfDayUTCISO(applicationStartDate),
          end: applicationEndDate && toEndOfDayUTCISO(applicationEndDate),
        }),
      );
    },
    [applicationStartDate, applicationEndDate],
  );
}
