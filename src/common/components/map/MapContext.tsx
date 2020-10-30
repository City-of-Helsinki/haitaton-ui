import React from 'react';
import OLVectorLayer from 'ol/layer/Layer';
import * as ol from 'ol';

type Layer = OLVectorLayer;

type MapContext = {
  map: ol.Map | null;
  layers: Layer[];
};

const MapContext = React.createContext<MapContext>({
  map: null,
  layers: [],
});

export default MapContext;
