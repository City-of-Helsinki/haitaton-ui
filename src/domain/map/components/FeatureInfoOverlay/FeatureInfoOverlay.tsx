import React from 'react';
import { Box } from '@chakra-ui/react';
import { Polygon } from 'ol/geom';
import { FeatureLike } from 'ol/Feature';
import { Pixel } from 'ol/pixel';
import center from '@turf/center';
import { points } from '@turf/helpers';
import useFeaturesAtPixel from '../../hooks/useFeaturesAtPixel';
import useDrawContext from '../../../../common/components/map/modules/draw/useDrawContext';
import MapOverlay from '../../../../common/components/map/overlay/Overlay';
import useDrawInteraction from '../../../../common/components/map/hooks/useDrawInteraction';
import useIsModifying from '../../../../common/components/map/hooks/useIsModifying';

function HoverElement({
  position,
  children,
}: Readonly<{ position?: Pixel; children: React.ReactNode }>) {
  if (!position) {
    return null;
  }

  return (
    <Box
      zIndex={2}
      position="absolute"
      style={{
        top: position[1] + 3,
        left: position[0] + 3,
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Overlay that shows information about the selected or hovered feature.
 */
function FeatureInfoOverlay({
  render,
}: {
  render: (feature?: FeatureLike | null) => React.ReactNode;
}) {
  const drawInteraction = useDrawInteraction();
  const isModifying = useIsModifying();

  const hoveredFeaturesWithPixel = useFeaturesAtPixel();

  const {
    state: { selectedFeature },
  } = useDrawContext();

  const selectedFeatureCoordinates = (selectedFeature?.getGeometry() as Polygon)?.getCoordinates();
  const selectedFeatureCenter =
    selectedFeatureCoordinates && selectedFeatureCoordinates.length === 1
      ? center(points(selectedFeatureCoordinates[0]))
      : undefined;

  return (
    <>
      {/* Use openlayers overlay for selected features */}
      <MapOverlay position={selectedFeatureCenter?.geometry.coordinates}>
        {render(selectedFeature)}
      </MapOverlay>
      {/* Use div element for hovered features. */}
      {!selectedFeature && !drawInteraction?.getActive() && !isModifying && (
        <HoverElement position={hoveredFeaturesWithPixel[0]?.featurePixel}>
          {render(hoveredFeaturesWithPixel[0]?.feature)}
        </HoverElement>
      )}
    </>
  );
}

export default FeatureInfoOverlay;
