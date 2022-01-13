import React, { useContext, useEffect, useCallback } from 'react';
import { Vector as VectorSource } from 'ol/source';
import MapContext from '../../../../common/components/map/MapContext';

type Props = {
  source: VectorSource;
};

const FitSource: React.FC<Props> = ({ source }) => {
  const { map } = useContext(MapContext);

  const fitSource = useCallback(() => {
    if (!map || !source || !source.isEmpty()) return;
    map.getView().fit(source.getExtent(), { padding: [100, 100, 100, 100] });
  }, [map, source]);

  useEffect(() => {
    source.on('featuresAdded', () => {
      fitSource();
    });
  }, []);

  return null;
};

export default FitSource;
