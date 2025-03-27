import React, { useCallback, useContext, useEffect } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { useLocation } from 'react-router-dom';
import MapContext from '../../../../common/components/map/MapContext';
import HoverContext from '../../../../common/components/map/interactions/hover/HoverContext';
import { styleFunction } from '../../utils/geometryStyle';

type Props = {
  source: VectorSource;
};

const HighlightFeatureOnMap: React.FC<React.PropsWithChildren<Props>> = ({ source }) => {
  const location = useLocation();
  const { map } = useContext(MapContext);
  const { hoveredHankeAreaData } = useContext(HoverContext);
  const hankeTunnus = new URLSearchParams(location.search).get('hanke');

  const highlightFeature = useCallback(() => {
    source.getFeatures().some((feature) => {
      if (
        hoveredHankeAreaData.includes(feature.get('hankeTunnus')) ||
        feature.get('hankeTunnus') === hankeTunnus
      ) {
        feature.setStyle(styleFunction(feature, undefined, true));
      } else {
        feature.setStyle(undefined);
      }
      return false;
    });
  }, [hankeTunnus, hoveredHankeAreaData, source]);

  useEffect(() => {
    source.on('addfeature', () => {
      highlightFeature();
    });
  }, [map, source, highlightFeature]);

  useEffect(() => {
    highlightFeature();
  }, [hankeTunnus, hoveredHankeAreaData, highlightFeature]);

  return null;
};

export default HighlightFeatureOnMap;
