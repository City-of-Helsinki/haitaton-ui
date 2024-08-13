import { useEffect } from 'react';
import { Vector } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { HAITTOJENHALLINTATYYPPI, HankeAlue } from '../../types/hanke';
import { HaittaIndexData } from '../../common/haittaIndexes/types';

/**
 * Add feature from hanke area to map
 * and add liikennehaittaindeksi as property
 */
export default function useHankealueFeature(
  source: Vector,
  hankealue: HankeAlue,
  tyyppi: HAITTOJENHALLINTATYYPPI | undefined | null,
) {
  useEffect(() => {
    source.clear();

    const indeksi = (tulos: HaittaIndexData | null | undefined) => {
      if (!tulos) return null;
      switch (tyyppi) {
        case HAITTOJENHALLINTATYYPPI.PYORALIIKENNE:
          return tulos.pyoraliikenneindeksi;
        case HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE:
          return tulos.autoliikenne.indeksi;
        case HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE:
          return tulos.raitioliikenneindeksi;
        case HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE:
          return tulos.linjaautoliikenneindeksi;
        default:
          return null;
      }
    };

    if (hankealue.geometriat) {
      const feature = new GeoJSON().readFeatures(
        hankealue.geometriat.featureCollection,
      )[0] as Feature<Geometry>;
      feature.setProperties(
        {
          liikennehaittaindeksi: indeksi(hankealue.tormaystarkasteluTulos),
          areaName: hankealue.nimi,
        },
        true,
      );
      source.addFeature(feature);
      source.dispatchEvent('featuresAdded');
    }
  }, [source, hankealue, tyyppi]);
}
