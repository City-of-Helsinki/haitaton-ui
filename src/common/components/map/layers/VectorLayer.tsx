import { useContext, useEffect } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { Style } from 'ol/style';
import OLVectorLayer from 'ol/layer/Vector';
import MapContext from '../MapContext';

type Props = {
  source: VectorSource;
  className: string;
  zIndex?: number;
  style?: Style;
};

const VectorLayer: React.FC<Props> = ({ source, className, zIndex = 0, style = undefined }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const vectorLayer = new OLVectorLayer({
      source,
      className,
      style,
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
