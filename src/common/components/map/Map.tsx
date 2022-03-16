import React, { useRef, useState, useEffect } from 'react';
import { Attribution, defaults as defaultControls } from 'ol/control';
import * as ol from 'ol';

import MapContext from './MapContext';
import { MapInstance } from './types';
import { projection } from './utils';
import 'ol/ol.css';

const defaultZoom = 9;
export const helsinkiCenterCoords = [25496750, 6673000];

export const attribution = new Attribution({
  collapsible: true,
  collapsed: false,
});

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
  const [layers] = useState({});

  useEffect(() => {
    if (mapRef.current == null) {
      return;
    }

    const options = {
      view: new ol.View({
        center,
        zoom,
        minZoom: 5,
        maxZoom: 13,
        projection,
      }),
      layers: [],
      controls: defaultControls({
        attribution: false,
        zoom: false,
        rotate: false,
      }).extend([attribution]),
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
    <MapContext.Provider value={{ map, layers }}>
      <div ref={mapRef} className={mapClassName} id="ol-map">
        {map && children}
      </div>
    </MapContext.Provider>
  );
};

export default Map;
