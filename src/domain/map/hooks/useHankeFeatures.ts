import { useEffect } from 'react';
import { Vector } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
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
      if (hanke.alueet?.length > 0) {
        const hankeFeatures = hanke.alueet.flatMap((alue) => {
          if (!alue.geometriat) {
            return [];
          }

          const feature = new GeoJSON().readFeatures(
            alue.geometriat.featureCollection,
          )[0] as Feature<Geometry>;

          feature.setProperties(
            {
              liikennehaittaindeksi: alue.tormaystarkasteluTulos
                ? alue.tormaystarkasteluTulos.liikennehaittaindeksi.indeksi
                : null,
              areaName: alue.nimi,
              hankeName: hanke.nimi,
              startDate: alue.haittaAlkuPvm,
              endDate: alue.haittaLoppuPvm,
            },
            true,
          );

          return feature;
        });

        source.addFeatures(hankeFeatures);
      }
    });
    source.dispatchEvent('featuresAdded');
  }, [source, hankkeet]);
}
