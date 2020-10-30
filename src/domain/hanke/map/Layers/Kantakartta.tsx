import React from 'react';
import { TileWMS } from 'ol/source';
import TileLayer from '../../../../common/components/map/layers/TileLayer';

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
        },
        imageSmoothing: false,
        hidpi: false,
        serverType: 'geoserver',
        transition: 0,
      })
    }
  />
);

export default Kantakartta;
