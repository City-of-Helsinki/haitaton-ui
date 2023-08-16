import { useContext, useEffect } from 'react';
import OLTileLayer from 'ol/layer/Tile';
import { TileWMS, OSM } from 'ol/source';
import MapContext from '../MapContext';

type Props = {
  source: TileWMS | OSM;
  minZoom?: number;
  maxZoom?: number;
  zIndex?: number;
  opacity?: number;
};

function TileLayer({ source, minZoom, maxZoom, zIndex = 0, opacity = 1 }: Props) {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const tileLayer = new OLTileLayer({
      source,
      minZoom,
      maxZoom,
      zIndex,
      opacity,
    });

    map.addLayer(tileLayer);
    tileLayer.setZIndex(zIndex);

    // eslint-disable-next-line
    return () => {
      if (map) {
        map.removeLayer(tileLayer);
      }
    };
  }, [map, maxZoom, minZoom, zIndex, source, opacity]);

  return null;
}

export default TileLayer;
