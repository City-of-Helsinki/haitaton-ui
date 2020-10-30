import { useContext, useEffect } from 'react';
import { Vector as VectorSource } from 'ol/source';
import OLVectorLayer from 'ol/layer/Vector';

import MapContext from '../MapContext';

type Props = {
  source: VectorSource;
  zIndex?: number;
};

const VectorLayer: React.FC<Props> = ({ source, zIndex = 0 }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const vectorLayer = new OLVectorLayer({
      source,
      // style,
    });

    map.addLayer(vectorLayer);
    vectorLayer.setZIndex(zIndex);

    // eslint-disable-next-line
    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map]);

  return null;
};

export default VectorLayer;
