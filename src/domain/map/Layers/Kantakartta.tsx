import React from 'react';
import { TileWMS } from 'ol/source';
import TileLayer from '../../../common/components/map/layers/TileLayer';
// import { projection } from '../../../common/components/map/utils';

// https://kartta.hel.fi/ws/geoserver/avoindata/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fjpeg&TRANSPARENT=true&LAYERS=Kantakartta&WIDTH=256&HEIGHT=256&SRS=EPSG%3A3857&STYLES=&BBOX=-14578070.034548815%2C6673258.317409027%2C-14577458.538322534%2C6673869.813635309
// https://kartta.hel.fi/ws/geoserver/avoindata/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=Kantakartta&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:3879&BBOX=25496200,6672700,25497000,6673500&WIDTH=400&HEIGHT=400
const Kantakartta = () => (
  <TileLayer
    zIndex={2}
    source={
      new TileWMS({
        url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms',
        params: {
          LAYERS: 'Kantakartta',
          FORMAT: 'image/png',
          WIDTH: 256,
          HEIGHT: 256,
          VERSION: '1.1.1',
          CRS: 'EPSG:3879',
          // tilematrixset: 'ETRS-GK25',
        },
        // projection: 'EPSG:3879',
        imageSmoothing: false,
        hidpi: false,
        serverType: 'geoserver',
        transition: 0,
      })
    }
  />
);

export default Kantakartta;
