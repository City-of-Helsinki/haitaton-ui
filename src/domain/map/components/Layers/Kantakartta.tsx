import React from 'react';
import { TileWMS } from 'ol/source';
import TileLayer from '../../../../common/components/map/layers/TileLayer';
import { projection } from '../../../../common/components/map/utils';

const sourceOptions = {
  url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms',
  projection,
  cacheSize: 1000,
  imageSmoothing: false,
  hidpi: false,
  serverType: 'geoserver',
  transition: 0,
  attributions: ['Aineistot &copy; <a href="https://kartta.hel.fi">Helsingin kaupunki</a>'],
};

const Kantakartta = () => (
  <>
    <TileLayer
      zIndex={2}
      minZoom={9}
      source={
        new TileWMS({
          ...sourceOptions,
          params: {
            LAYERS: 'Kantakartta',
            FORMAT: 'image/jpeg',
            WIDTH: 256,
            HEIGHT: 256,
            VERSION: '1.1.1',
            TRANSPARENT: 'false',
          },
        })
      }
    />
    <TileLayer
      zIndex={2}
      maxZoom={9}
      source={
        new TileWMS({
          ...sourceOptions,
          params: {
            LAYERS: 'Opaskartta_Helsinki',
            FORMAT: 'image/jpeg',
            WIDTH: 256,
            HEIGHT: 256,
            VERSION: '1.1.1',
            TRANSPARENT: 'false',
          },
        })
      }
    />
  </>
);

export default Kantakartta;
