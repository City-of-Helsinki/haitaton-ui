import React, { useRef, useState, useEffect } from 'react';
import * as ol from 'ol';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';

import MapContext from './MapContext';
import { SelectedDrawtoolType, MapInstance } from './types';

const defaultZoom = 13;
const helsinkiCoordinates = [2776000, 8438000];

proj4.defs(
  'EPSG:3879',
  '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);
register(proj4);
export const haitatonProjection = getProjection('EPSG:3879');

// proj4.defs("EPSG:3879","+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

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
        minZoom: 12,
        maxZoom: 22,
        // projection: haitatonProjection,
      }),
      layers: [],
      controls: [],
      overlays: [],
    };

    const mapObject = new ol.Map(options);
    console.log({ mapObject });
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
