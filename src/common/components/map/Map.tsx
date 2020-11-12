import React, { useRef, useState, useEffect } from 'react';
import * as ol from 'ol';
import MapContext from './MapContext';
import { SelectedDrawTool, MapInstance } from './types';

const defaultZoom = 13;
const helsinkiCoordinates = [2776000, 8438000];

type Props = {
  zoom: number;
  center?: number[];
  mapClassName?: string;
};

const Map: React.FC<Props> = ({
  children,
  zoom = defaultZoom,
  center = helsinkiCoordinates,
  mapClassName,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapInstance>(null);
  const [drawTool, setDrawTool] = useState<SelectedDrawTool>('');
  const [layers] = useState([]);

  useEffect(() => {
    if (mapRef.current == null) {
      return;
    }

    const options = {
      view: new ol.View({
        center,
        zoom,
        minZoom: 12,
        maxZoom: 22,
        projection: 'EPSG:3857',
      }),
      layers: [],
      controls: [],
      overlays: [],
    };

    const mapObject = new ol.Map(options);
    mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    // eslint-disable-next-line
    return () => mapObject.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (!map) return;
    map.getView().setZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    if (!map) return;

    map.getView().setCenter(center);
  }, [center]);

  return (
    <MapContext.Provider value={{ map, layers, drawTool, setDrawTool }}>
      <div ref={mapRef} className={mapClassName}>
        {children}
      </div>
    </MapContext.Provider>
  );
};

export default Map;
