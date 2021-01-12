import React from 'react';
import { TileWMS } from 'ol/source';
import TileLayer from '../../../common/components/map/layers/TileLayer';
import { projection } from '../../../common/components/map/utils';

const Ortokartta = () => (
  <TileLayer
    zIndex={2}
    source={
      new TileWMS({
        url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms',
        params: {
          LAYERS: 'Ortoilmakuva_2020_5cm',
          FORMAT: 'image/jpeg',
          WIDTH: 256,
          HEIGHT: 256,
          VERSION: '1.1.1',
          TRANSPARENT: 'false',
        },
        projection,
        imageSmoothing: false,
        hidpi: false,
        serverType: 'geoserver',
        transition: 0,
      })
    }
  />
);

export default Ortokartta;
