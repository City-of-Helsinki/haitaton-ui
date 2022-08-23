import { useContext, useEffect } from 'react';
import OLTileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import * as ol from 'ol';
import { OverviewMap } from 'ol/control';
import { DragZoom } from 'ol/interaction';
import MapContext from '../MapContext';
import { projection } from '../utils';
import './MapControl.scss';

const MapControl: React.FC = () => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const overviewMapTileLayer = new OLTileLayer({
      source: new TileWMS({
        url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms',
        params: {
          LAYERS: 'Kantakartta',
          FORMAT: 'image/jpeg',
          WIDTH: 256,
          HEIGHT: 256,
          VERSION: '1.1.1',
          TRANSPARENT: 'false',
        },
        projection,
        cacheSize: 1000,
        imageSmoothing: false,
        hidpi: false,
        serverType: 'geoserver',
        transition: 0,
      }),
    });

    const overviewMapControl = new OverviewMap({
      className: 'ol-overviewmap ol-custom-overviewmap',
      layers: [overviewMapTileLayer],
      collapseLabel: '\u00BB',
      label: '\u00BB',
      collapsed: false,
      view: new ol.View({
        zoom: 3,
        minZoom: 2,
        maxZoom: 6,
        projection,
      }),
    });

    map.addControl(overviewMapControl);
    map.addInteraction(new DragZoom());

    // eslint-disable-next-line
    return () => {
      if (map) {
        map.removeControl(overviewMapControl);
      }
    };
  }, [map]);

  return null;
};

export default MapControl;
