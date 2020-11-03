import React from 'react';
import { Layer } from 'ol/layer';
import { SelectedDrawTool, MapInstance } from './types';

type MapContext = {
  map: MapInstance;
  drawTool: SelectedDrawTool;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setDrawTool: any;
  layers: Layer[]; // Not sure yet is these necessary to keep in context
};

const MapContext = React.createContext<MapContext>({
  map: null,
  drawTool: '', // Maybe should be moved to redux in future
  setDrawTool: null, // Maybe should be moved to redux in future
  layers: [],
});

export default MapContext;
