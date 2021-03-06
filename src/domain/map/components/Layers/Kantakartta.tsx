import React from 'react';
import { TileWMS } from 'ol/source';
import TileLayer from '../../../../common/components/map/layers/TileLayer';
import { projection } from '../../../../common/components/map/utils';

const Kantakartta = () => (
  <TileLayer
    zIndex={2}
    source={
      new TileWMS({
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
        attributions: ['Aineistot &copy; <a href="https://kartta.hel.fi">Helsingin kaupunki</a>'],
      })
    }
  />
);

export default Kantakartta;
