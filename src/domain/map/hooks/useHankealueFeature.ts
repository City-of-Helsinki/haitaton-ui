import { useEffect } from 'react';
import { Vector } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { HankeAlue } from '../../types/hanke';

/**
 * Add feature from hanke area to map
 * and add liikennehaittaindeksi as property
 */
export default function useHankealueFeature(source: Vector, hankealue: HankeAlue, indeksi: number) {
  useEffect(() => {
    source.clear();

    if (hankealue.geometriat?.featureCollection) {
      const features = new GeoJSON().readFeatures(
        hankealue.geometriat.featureCollection,
      ) as Feature<Geometry>[];
      const feature = features[0];
      if (feature) {
        feature.setProperties(
          {
            liikennehaittaindeksi: indeksi,
            areaName: hankealue.nimi,
          },
          true,
        );
        source.addFeature(feature);
        source.dispatchEvent('featuresAdded');
      }
    }
  }, [source, hankealue, indeksi]);
}
