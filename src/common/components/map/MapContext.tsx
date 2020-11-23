import React from 'react';
import { Layer } from 'ol/layer';
import { SelectedDrawtoolType, MapInstance } from './types';

type MapContext = {
  map: MapInstance;
  selectedDrawtoolType: SelectedDrawtoolType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedDrawtoolType: any;
  layers: Layer[]; // Not sure yet is these necessary to keep in context
};

const MapContext = React.createContext<MapContext>({
  map: null,
  selectedDrawtoolType: '', // Maybe should be moved to redux in future
  setSelectedDrawtoolType: null, // Maybe should be moved to redux in future
  layers: [],
});

export default MapContext;
