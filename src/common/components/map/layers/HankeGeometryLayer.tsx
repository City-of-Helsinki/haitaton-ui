import { useContext, useEffect } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke } from 'ol/style';
import OLVectorLayer from 'ol/layer/Vector';
import MapContext from '../MapContext';

type Props = {
  source: VectorSource;
  className: string;
  zIndex?: number;
};

// Temporary reference style implementation. Actual colors
// are chosen based on törmäysanalyysi
const geometryStyle = {
  Blue: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(36, 114, 198, 1)',
    }),
  }),
};

const HankeGeometryLayer: React.FC<Props> = ({ source, className, zIndex = 0 }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const hankeGeometryLayer = new OLVectorLayer({
      source,
      className,
      style: geometryStyle.Blue,
    });

    map.addLayer(hankeGeometryLayer);
    hankeGeometryLayer.setZIndex(zIndex);

    // eslint-disable-next-line
    return () => {
      if (map) {
        map.removeLayer(hankeGeometryLayer);
      }
    };
  }, [map]);

  return null;
};

export default HankeGeometryLayer;
