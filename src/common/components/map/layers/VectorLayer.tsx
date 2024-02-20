import { useContext, useEffect } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { StyleLike } from 'ol/style/Style';
import OLVectorLayer from 'ol/layer/Vector';
import MapContext from '../MapContext';
import { STYLES } from '../../../../domain/map/utils/geometryStyle';

type Props = {
  source: VectorSource;
  className: string;
  zIndex?: number;
  style?: StyleLike;
};

function VectorLayer({ source, className, zIndex = 0, style = STYLES.BLUE }: Readonly<Props>) {
  const { map, layers } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const vectorLayer = new OLVectorLayer({
      source,
      className,
      style,
    });

    map.addLayer(vectorLayer);
    vectorLayer.setZIndex(zIndex);

    layers[className] = vectorLayer;

    // eslint-disable-next-line
    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map, className, style, layers, source, zIndex]);

  return null;
}

export default VectorLayer;
