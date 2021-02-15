import React from 'react';
import { OSM } from 'ol/source';
import TileLayer from '../../../../common/components/map/layers/TileLayer';

const HSL = () => (
  <TileLayer
    zIndex={0}
    source={
      new OSM({
        url: 'https://cdn.digitransit.fi/map/v1/hsl-map/{z}/{x}/{y}.png',
        attributions: [
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        ],
      })
    }
  />
);

export default HSL;
