import { useEffect } from 'react';
import { Vector } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { HankeData } from '../../types/hanke';

/**
 * Add features from hanke areas to map
 * and add liikennehaittaindeksi as property
 * for each feature
 */
export default function useHankeFeatures(source: Vector, hankkeet: HankeData[]) {
  useEffect(() => {
    source.clear();
    hankkeet.forEach((hanke) => {
      if (hanke.geometriat) {
        const hankeFeatures = new GeoJSON().readFeatures(hanke.geometriat.featureCollection);
        hankeFeatures.forEach((feature) => {
          feature.setProperties(
            {
              liikennehaittaindeksi: hanke.liikennehaittaindeksi
                ? hanke.liikennehaittaindeksi.indeksi
                : null,
            },
            true
          );
        });
        source.addFeatures(hankeFeatures);
      }
    });
    source.dispatchEvent('featuresAdded');
  }, [source, hankkeet]);
}
