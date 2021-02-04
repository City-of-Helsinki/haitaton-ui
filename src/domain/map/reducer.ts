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

const currentYear = new Date().getFullYear();

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
  (Object.keys(state.mapTileLayers) as Array<keyof typeof state.mapTileLayers>).forEach(
    (mapTileLayerKey) => {
      state.mapTileLayers[mapTileLayerKey].visible = action.payload === mapTileLayerKey;
    }
  );
};

const updateDrawGeometry: CaseReducer<ReducerState, PayloadAction<HankeGeoJSON>> = (
  state,
  action
) => {
  state.drawGeometry = action.payload;
};

const setHankeFilterStartDate: CaseReducer<ReducerState, PayloadAction<string>> = (
  state,
  action
) => {
  state.hankeFilterStartDate = action.payload;
};

const setHankeFilterEndDate: CaseReducer<ReducerState, PayloadAction<string>> = (state, action) => {
  state.hankeFilterEndDate = action.payload;
};

const buildDatalayerState = (key: MapDataLayerKey, data: CommonGeoJSON): MapDatalayerState => ({
  key,
  data,
  visible: false,
});

const buildTilelayerState = (id: MapTileLayerId, visible: boolean): MapTilelayerState => ({
  id,
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
    [MAPTILES.ORTOKARTTA]: buildTilelayerState(MAPTILES.ORTOKARTTA, false),
    [MAPTILES.KANTAKARTTA]: buildTilelayerState(MAPTILES.KANTAKARTTA, true),
  },
  hankeFilterStartDate: `${currentYear}-01-01`,
  hankeFilterEndDate: `${currentYear + 1}-12-31`,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    selectProject,
    updateDrawGeometry,
    toggleLayer,
    toggleMapTileLayer,
    setHankeFilterStartDate,
    setHankeFilterEndDate,
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
