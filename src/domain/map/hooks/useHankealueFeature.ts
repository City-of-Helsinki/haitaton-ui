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
export default function useHankealueFeature(source: Vector, hankealue: HankeAlue) {
  useEffect(() => {
    source.clear();
    if (hankealue.geometriat) {
      const feature = new GeoJSON().readFeatures(
        hankealue.geometriat.featureCollection,
      )[0] as Feature<Geometry>;
      feature.setProperties(
        {
          liikennehaittaindeksi: hankealue.tormaystarkasteluTulos
            ? hankealue.tormaystarkasteluTulos.liikennehaittaindeksi.indeksi
            : null,
          areaName: hankealue.nimi,
        },
        true,
      );
      source.addFeature(feature);
      source.dispatchEvent('featuresAdded');
    }
  }, [source, hankealue]);
}
