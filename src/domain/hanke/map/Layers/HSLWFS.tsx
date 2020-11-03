import React from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from 'ol/source';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';

// https://kartta.hel.fi/ws/geoserver/avoindata/wfs?service=wfs&version=1.1.0&request=GetCapabilities
const vectorSource = new VectorSource({
  format: new GeoJSON(),
  // eslint-disable-next-line
  url: function (extent) {
    return (
      // eslint-disable-next-line
      'https://kartta.hel.fi/ws/geoserver/avoindata/wfs?' +
      'service=wfs&version=1.1.0&request=GetCapabilities&typeNS=avoindata&typename=Kaupunginosajako&' +
      'outputFormat=json&srsname=EPSG:3879&' +
      'bbox=' +
      extent.join(',') +
      ',EPSG:3879'
    );
  },
  strategy: bboxStrategy,
});

const HSLWFS = () => <VectorLayer source={vectorSource} zIndex={100} />;

export default HSLWFS;
/*
  var vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: function (extent) {
      return (
        'https://ahocevar.com/geoserver/wfs?service=WFS&' +
        'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
        'outputFormat=application/json&srsname=EPSG:3857&' +
        'bbox=' +
        extent.join(',') +
        ',EPSG:3857'
      );
    },
    strategy: bboxStrategy,
  });

const kaupunginosat = new L.WFS({
    url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wfs?',
    typeNS: 'avoindata',
    typeName: 'Kaupunginosajako',
    crs: EPSG3879(),
    style: {
        color: 'blue',
        weight: 2
    }
  })

  */
