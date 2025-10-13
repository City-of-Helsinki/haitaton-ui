import { useEffect } from 'react';
import { Vector } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { formatFeaturesToHankeGeoJSON } from '../utils';
import { HankeData } from '../../types/hanke';
import { OverlayProps } from '../../../common/components/map/types';

/**
 * Add features from hanke areas to map
 * and add liikennehaittaindeksi as property
 * for each feature
 */
export default function useHankeFeatures(
  source: Vector,
  hankkeet: HankeData[],
  fullDetails = true,
) {
  useEffect(() => {
    source.clear();
    hankkeet.forEach((hanke) => {
      if (!hanke.alueet || hanke.alueet.length === 0) return;
      const hankeFeatures = hanke.alueet.flatMap((alue) => {
        // Primary path: geometriat.featureCollection
        let feature: Feature<Geometry> | undefined;
        if (alue.geometriat?.featureCollection?.features?.length) {
          const rawFeatures = new GeoJSON().readFeatures(
            alue.geometriat.featureCollection,
          ) as Feature<Geometry>[];
          feature = rawFeatures[0];
        }
        // Fallback: hydrated OpenLayers feature present on form state (persistence rehydration)
        if (!feature && (alue as unknown as { feature?: Feature<Geometry> }).feature) {
          feature = (alue as unknown as { feature: Feature<Geometry> }).feature;
          // If geometriat is missing entirely, synthesize a minimal featureCollection snapshot for consumers.
          if (!alue.geometriat) {
            const fc = formatFeaturesToHankeGeoJSON([feature]);
            try {
              const mutated = alue as unknown as { geometriat?: Record<string, unknown> };
              mutated.geometriat = { featureCollection: fc } as unknown as typeof alue.geometriat;
            } catch {
              // ignore assignment failure
            }
          }
        }
        if (!feature) return [];
        feature.setProperties(
          {
            liikennehaittaindeksi: alue.tormaystarkasteluTulos
              ? alue.tormaystarkasteluTulos.liikennehaittaindeksi.indeksi
              : null,
            areaName: alue.nimi,
            hankeName: hanke.nimi,
            id: alue.id,
            overlayProps: new OverlayProps({
              heading: alue.nimi,
              subHeading: fullDetails ? `${hanke.nimi} (${hanke.hankeTunnus})` : null,
              startDate: fullDetails ? alue.haittaAlkuPvm : null,
              endDate: fullDetails ? alue.haittaLoppuPvm : null,
              backgroundColor: 'var(--color-summer-light)',
              enableCopyArea: true,
            }),
          },
          true,
        );
        return feature;
      });
      if (hankeFeatures.length) {
        source.addFeatures(hankeFeatures);
      }
    });
    source.dispatchEvent('featuresAdded');
  }, [source, hankkeet, fullDetails]);
}
