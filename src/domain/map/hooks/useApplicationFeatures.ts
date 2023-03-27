import { useEffect } from 'react';
import { Vector } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { ApplicationArea } from '../../application/types/application';

/**
 * Add features from application areas to map
 */
export default function useApplicationFeatures(source: Vector, areas?: ApplicationArea[]) {
  useEffect(() => {
    if (areas && areas.length > 0) {
      const applicationFeatures = areas.flatMap((area) => {
        return new GeoJSON().readFeatures(area.geometry);
      });
      source.addFeatures(applicationFeatures);
    }

    return function cleanup() {
      source.clear();
    };
  }, [source, areas]);
}
