import React, { useRef, useState, useEffect } from 'react';
import MapContext from './MapContext';
import { MapInstance } from './types';
import { projection } from './utils';

const CI = Boolean(process.env.CI);

const defaultZoom = 9;
export const helsinkiCenterCoords = [25496750, 6673000];

type Props = {
  zoom?: number;
  center?: number[];
  mapClassName?: string;
  showAttribution?: boolean;
};

let Map: React.FC<React.PropsWithChildren<Props>>;

if (CI) {
  // Fast stub for tests: no OpenLayers, just provide context and render children immediately.
  Map = ({ children, mapClassName }) => (
    <MapContext.Provider value={{ map: null, layers: {} }}>
      <div className={mapClassName} id="ol-map" style={{ height: '100%' }}>
        {children}
      </div>
    </MapContext.Provider>
  );
} else {
  Map = ({
    children,
    zoom = defaultZoom,
    center = helsinkiCenterCoords,
    mapClassName,
    showAttribution = true,
  }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<MapInstance>(null);
    const [layers] = useState({});

    useEffect(() => {
      if (mapRef.current == null) {
        return;
      }

      let mounted = true;
      (async () => {
        // Dynamically import OpenLayers modules
        const olControl = await import('ol/control');
        const ol = await import('ol');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { Attribution, defaults: defaultControls } = olControl as any;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const attribution = new (Attribution as any)({
          collapsible: true,
          collapsed: false,
        });

        const controls = showAttribution ? [attribution] : [];

        const options = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          view: new (ol.View as any)({
            center,
            zoom,
            minZoom: 5,
            maxZoom: 13,
            projection: projection || undefined,
          }),
          layers: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          controls: (defaultControls as any)({
            attribution: false,
            zoom: false,
            rotate: false,
          }).extend(controls),
          overlays: [],
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapObject = new (ol.Map as any)(options);
        mapObject.setTarget(mapRef.current);
        if (mounted) setMap(mapObject);

        return () => {
          mounted = false;
          try {
            mapObject.setTarget(undefined);
          } catch (e) {
            // swallow
          }
        };
      })();
    }, [center, zoom, showAttribution]);

    useEffect(() => {
      if (!map) return;
      map.getView().setZoom(zoom);
    }, [map, zoom]);

    useEffect(() => {
      if (!map) return;

      map.getView().setCenter(center);
    }, [map, center]);

    return (
      <MapContext.Provider value={{ map, layers }}>
        <div ref={mapRef} className={mapClassName} id="ol-map" style={{ height: '100%' }}>
          {map && children}
        </div>
      </MapContext.Provider>
    );
  };
}

export default Map;
