import React from 'react';
import { Layer } from 'ol/layer';
import { MapInstance } from './types';

type MapContext = {
  map: MapInstance;
  layers: Record<string, Layer>; // Not sure yet is these necessary to keep in context
};

const MapContext = React.createContext<MapContext>({
  map: null,
  layers: {},
});

export default MapContext;
