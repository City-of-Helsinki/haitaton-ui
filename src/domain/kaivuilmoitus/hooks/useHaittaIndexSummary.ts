import { useMutation } from 'react-query';
import api from '../../api/api';
import {
  HANKE_KAISTAHAITTA_KEY,
  HANKE_KAISTAPITUUSHAITTA_KEY,
  HankeGeometria,
} from '../../types/hanke';
import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../../common/haittaIndexes/types';

function calculateLiikennehaittaindeksienYhteenveto(
  haittaindeksit: HaittaIndexData[],
): HaittaIndexData {
  return haittaindeksit.reduce(
    (acc, haittaindeksi) => {
      return {
        liikennehaittaindeksi: {
          indeksi: Math.max(
            acc.liikennehaittaindeksi.indeksi,
            haittaindeksi.liikennehaittaindeksi.indeksi,
          ),
          tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
        },
        pyoraliikenneindeksi: Math.max(
          acc.pyoraliikenneindeksi,
          haittaindeksi.pyoraliikenneindeksi,
        ),
        autoliikenne: {
          indeksi: Math.max(acc.autoliikenne.indeksi, haittaindeksi.autoliikenne.indeksi),
          haitanKesto: Math.max(
            acc.autoliikenne.haitanKesto,
            haittaindeksi.autoliikenne.haitanKesto,
          ),
          katuluokka: Math.max(acc.autoliikenne.katuluokka, haittaindeksi.autoliikenne.katuluokka),
          liikennemaara: Math.max(
            acc.autoliikenne.liikennemaara,
            haittaindeksi.autoliikenne.liikennemaara,
          ),
          kaistahaitta: Math.max(
            acc.autoliikenne.kaistahaitta,
            haittaindeksi.autoliikenne.kaistahaitta,
          ),
          kaistapituushaitta: Math.max(
            acc.autoliikenne.kaistapituushaitta,
            haittaindeksi.autoliikenne.kaistapituushaitta,
          ),
        },
        linjaautoliikenneindeksi: Math.max(
          acc.linjaautoliikenneindeksi,
          haittaindeksi.linjaautoliikenneindeksi,
        ),
        raitioliikenneindeksi: Math.max(
          acc.raitioliikenneindeksi,
          haittaindeksi.raitioliikenneindeksi,
        ),
      };
    },
    {
      liikennehaittaindeksi: {
        indeksi: 0,
        tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
      },
      pyoraliikenneindeksi: 0,
      autoliikenne: {
        indeksi: 0,
        haitanKesto: 0,
        katuluokka: 0,
        liikennemaara: 0,
        kaistahaitta: 0,
        kaistapituushaitta: 0,
      },
      linjaautoliikenneindeksi: 0,
      raitioliikenneindeksi: 0,
    },
  );
}

type TormaystarkasteluRequest = {
  geometriat: HankeGeometria;
  haittaAlkuPvm: Date;
  haittaLoppuPvm: Date;
  kaistaHaitta: HANKE_KAISTAHAITTA_KEY;
  kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY;
};

/**
 * Request haittaindeksit for multiple areas and calculate summary for them
 */
async function calculateHaittaindeksityhteenveto(data: TormaystarkasteluRequest[]) {
  const haittaindeksit = await Promise.all(
    data.map(async (d) => {
      const { data: response } = await api.post<HaittaIndexData>('/haittaindeksit', d);
      return response;
    }),
  );
  return calculateLiikennehaittaindeksienYhteenveto(haittaindeksit);
}

export default function useHaittaIndexSummary() {
  return useMutation(calculateHaittaindeksityhteenveto);
}
