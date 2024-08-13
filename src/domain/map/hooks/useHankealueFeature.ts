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
export default function useHankealueFeature(
  source: Vector,
  hankealue: HankeAlue,
  indeksi: number | null,
) {
  console.log(indeksi);
  useEffect(() => {
    source.clear();
    if (hankealue.geometriat) {
      const feature = new GeoJSON().readFeatures(
        hankealue.geometriat.featureCollection,
      )[0] as Feature<Geometry>;
      feature.setProperties(
        {
          // this does not work as it should:
          liikennehaittaindeksi: indeksi,
          // this works as it should:
          //liikennehaittaindeksi: 3,
          areaName: hankealue.nimi,
        },
        true,
      );
      console.log('feature', feature);
      source.addFeature(feature);
      source.dispatchEvent('featuresAdded');
    }
  }, [source, hankealue, indeksi]);
}
