import React from 'react';
import { Polygon } from 'ol/geom';
import { FeatureLike } from 'ol/Feature';
import center from '@turf/center';
import { points } from '@turf/helpers';
import useFeaturesAtPixel from '../../hooks/useFeaturesAtPixel';
import useDrawContext from '../../../../common/components/map/modules/draw/useDrawContext';
import MapOverlay from '../../../../common/components/map/overlay/Overlay';

/**
 * Overlay that shows information about the selected or hovered feature.
 */
function FeatureInfoOverlay({
  render,
}: {
  render: (feature?: FeatureLike | null) => React.ReactNode;
}) {
  const hoveredFeaturesWithPixel = useFeaturesAtPixel();
  const hoveredFeatures = hoveredFeaturesWithPixel.map((item) => item.feature);

  const {
    state: { selectedFeature },
  } = useDrawContext();

  const selectedAndHoveredFeatures = selectedFeature
    ? [selectedFeature, ...hoveredFeatures]
    : hoveredFeatures;

  const firstFeature = selectedAndHoveredFeatures[0];
  const firstFeatureCoordinates = (firstFeature?.getGeometry() as Polygon)?.getCoordinates();
  const firstFeatureCenter =
    firstFeatureCoordinates && firstFeatureCoordinates.length === 1
      ? center(points(firstFeatureCoordinates[0]))
      : undefined;

  return (
    <MapOverlay position={firstFeatureCenter?.geometry.coordinates}>
      {render(firstFeature)}
    </MapOverlay>
  );
}

export default FeatureInfoOverlay;
