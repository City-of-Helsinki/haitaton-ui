import { useEffect, useRef } from 'react';
import { Vector } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { ApplicationArea, Tyoalue } from '../../application/types/application';
import { getAreaDefaultName } from '../../application/utils';
import { TFunction } from 'i18next';
import { OverlayProps } from '../../../common/components/map/types';

/**
 * Add features from application areas to map
 */
export default function useApplicationFeatures(
  source: Vector,
  t: TFunction,
  areas?: ApplicationArea[] | Tyoalue[],
  featureProperties: { [x: string]: unknown } = {},
) {
  const featuresAdded = useRef(false);

  useEffect(() => {
    if (areas && areas.length > 0 && !featuresAdded.current) {
      const applicationFeatures = areas.map((area, index) => {
        const feature = new GeoJSON().readFeatures(area.geometry)[0] as Feature<Geometry>;
        const areaName = getAreaDefaultName(t, index, areas.length);

        feature.setProperties(
          {
            overlayProps: new OverlayProps({
              heading: areaName,
              backgroundColor: 'var(--color-suomenlinna-light)',
            }),
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
      featuresAdded.current = true;
    }
  }, [source, areas, featureProperties, t]);
}
