import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import projectsJSON from '../../mocks/projects.json';
import intersectJSON from '../../mocks/intersect.json';
import { CommonGeoJSON, HankeGeoJSON } from '../../common/types/hanke';
import { saveGeometryData } from './thunks';
import {
  ReducerState,
  MapDataLayerKey,
  MapTileLayerId,
  MapDatalayerState,
  MapTilelayerState,
} from './types';
import { DATALAYERS, MAPTILES } from './constants';

const selectProject: CaseReducer<ReducerState, PayloadAction<string>> = (state, action) => {
  state.selectedProject = action.payload;
};

const toggleLayer: CaseReducer<ReducerState, PayloadAction<MapDataLayerKey>> = (state, action) => {
  state.dataLayers[action.payload].visible = !state.dataLayers[action.payload].visible;
};

const toggleMapTileLayer: CaseReducer<ReducerState, PayloadAction<MapTileLayerId>> = (
  state,
  action
) => {
  state.mapTileLayers[action.payload].visible = !state.mapTileLayers[action.payload].visible; // TODO: map state must be togglable, i.e. when one goes true all others go false
};

const updateDrawGeometry: CaseReducer<ReducerState, PayloadAction<HankeGeoJSON>> = (
  state,
  action
) => {
  state.drawGeometry = action.payload;
};

const buildDatalayerState = (key: MapDataLayerKey, data: CommonGeoJSON): MapDatalayerState => ({
  key,
  data,
  visible: false,
});

const buildTilelayerState = (
  id: string, // TODO: import fromt costants
  label: string,
  visible: boolean
): MapTilelayerState => ({
  id,
  label,
  visible,
});

const initialState: ReducerState = {
  projects: projectsJSON.louhiProjects as CommonGeoJSON,
  status: '',
  error: '',
  selectedProject: null,
  drawGeometry: null,
  visibleLayers: [],
  dataLayers: {
    [DATALAYERS.RESTAURANTS]: buildDatalayerState(
      DATALAYERS.RESTAURANTS,
      intersectJSON.restaurantsGeoJSON as CommonGeoJSON
    ),
    [DATALAYERS.ROADS]: buildDatalayerState(
      DATALAYERS.ROADS,
      intersectJSON.roadsGeoJSON as CommonGeoJSON
    ),
    [DATALAYERS.CYCLING_ROADS]: buildDatalayerState(
      DATALAYERS.CYCLING_ROADS,
      intersectJSON.cyclingRoadsGeoJSON as CommonGeoJSON
    ),
    [DATALAYERS.GREENERY]: buildDatalayerState(
      DATALAYERS.GREENERY,
      intersectJSON.greeneryGeoJSON as CommonGeoJSON
    ),
  },
  mapTileLayers: {
    [MAPTILES.ORTOKARTTA]: buildTilelayerState('ortokartta', 'Ortokartta', true),
    [MAPTILES.KANTAKARTTA]: buildTilelayerState('kantakartta', 'Kantakartta', false),
  },
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    selectProject,
    updateDrawGeometry,
    toggleLayer,
    toggleMapTileLayer,
  },
  extraReducers: (builder) => {
    builder.addCase(saveGeometryData.fulfilled, (state) => {
      state.status = 'ok';
    });
    builder.addCase(saveGeometryData.rejected, (state) => {
      state.status = 'error';
    });
  },
});

export const { actions, caseReducers } = mapSlice;

export default mapSlice.reducer;
