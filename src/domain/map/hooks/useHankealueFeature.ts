import { useEffect } from 'react';
import { Vector } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { formatFeaturesToHankeGeoJSON } from '../utils';
import { HankeAlue } from '../../types/hanke';

/**
 * Add feature from hanke area to map
 * and add liikennehaittaindeksi as property
 */
export default function useHankealueFeature(source: Vector, hankealue: HankeAlue, indeksi: number) {
  useEffect(() => {
    source.clear();
    let feature: Feature<Geometry> | undefined;
    if (hankealue.geometriat?.featureCollection?.features?.length) {
      const features = new GeoJSON().readFeatures(
        hankealue.geometriat.featureCollection,
      ) as Feature<Geometry>[];
      feature = features[0];
    }
    // Fallback to hydrated form state's feature if featureCollection missing
    if (!feature && (hankealue as unknown as { feature?: Feature<Geometry> }).feature) {
      feature = (hankealue as unknown as { feature: Feature<Geometry> }).feature;
      if (!hankealue.geometriat) {
        const fc = formatFeaturesToHankeGeoJSON([feature]);
        try {
          const mutated = hankealue as unknown as { geometriat?: Record<string, unknown> };
          mutated.geometriat = { featureCollection: fc } as unknown as typeof hankealue.geometriat;
        } catch {
          // ignore
        }
      }
    }
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
  }, [source, hankealue, indeksi]);
}
