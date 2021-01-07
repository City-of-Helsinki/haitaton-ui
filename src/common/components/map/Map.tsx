import React, { useRef, useState, useEffect } from 'react';
import * as ol from 'ol';
import MapContext from './MapContext';
import { SelectedDrawtoolType, MapInstance } from './types';
import { projection } from './utils';

const defaultZoom = 13;
export const helsinkiCenterCoords = [25495389.68, 6671209.77];

type Props = {
  zoom: number;
  center?: number[];
  mapClassName?: string;
};

const Map: React.FC<Props> = ({
  children,
  zoom = defaultZoom,
  center = helsinkiCenterCoords,
  mapClassName,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapInstance>(null);
  const [selectedDrawtoolType, setSelectedDrawtoolType] = useState<SelectedDrawtoolType>('');
  const [layers] = useState([]);

  useEffect(() => {
    if (mapRef.current == null) {
      return;
    }

    const options = {
      view: new ol.View({
        center,
        zoom,
        minZoom: 5,
        maxZoom: 15,
        projection,
        constrainResolution: true,
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
    <MapContext.Provider value={{ map, layers, selectedDrawtoolType, setSelectedDrawtoolType }}>
      <div ref={mapRef} className={mapClassName} id="ol-map">
        {children}
      </div>
    </MapContext.Provider>
  );
};

export default Map;
