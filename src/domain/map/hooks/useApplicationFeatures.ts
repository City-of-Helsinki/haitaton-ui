import { useEffect } from 'react';
import { Vector } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { ApplicationArea } from '../../application/types/application';

/**
 * Add features from application areas to map
 */
export default function useApplicationFeatures(
  source: Vector,
  areas?: ApplicationArea[],
  featureProperties: { [x: string]: unknown } = {},
) {
  useEffect(() => {
    if (areas && areas.length > 0) {
      const applicationFeatures = areas.map((area) => {
        const feature = new GeoJSON().readFeatures(area.geometry)[0] as Feature<Geometry>;

        feature.setProperties(
          {
            liikennehaittaindeksi: area.tormaystarkasteluTulos
              ? area.tormaystarkasteluTulos.liikennehaittaindeksi.indeksi
              : null,
            ...featureProperties,
          },
          true,
        );

        return feature;
      }) as Feature<Geometry>[];
      source.addFeatures(applicationFeatures);
    }

    return function cleanup() {
      source.clear();
    };
  }, [source, areas, featureProperties]);
}
