import React, { useContext, useEffect, useCallback } from 'react';
import { Vector as VectorSource } from 'ol/source';
import MapContext from '../../../../common/components/map/MapContext';

type Props = {
  source: VectorSource;
  fitOnce?: boolean;
};

const FitSource: React.FC<React.PropsWithChildren<Props>> = ({ source, fitOnce = false }) => {
  const { map } = useContext(MapContext);

  const fitSource = useCallback(() => {
    if (!map || !source || source.isEmpty()) return;
    map.getView().fit(source.getExtent(), { padding: [100, 100, 100, 100] });
  }, [map, source]);

  useEffect(() => {
    setTimeout(fitSource, 0);

    if (!fitOnce) {
      source.on('addfeature', fitSource);
    }

    return function cleanUp() {
      source.un('addfeature', fitSource);
    };
  }, [source, fitSource, fitOnce]);

  return null;
};

export default FitSource;
