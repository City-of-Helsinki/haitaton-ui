import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { HankeGeoJSON } from '../../common/types/hanke';
import { saveGeometryData } from './thunks';
import { ReducerState, MapTileLayerId, MapTilelayerState } from './types';
import { MAPTILES } from './constants';

const currentYear = new Date().getFullYear();

const selectProject: CaseReducer<ReducerState, PayloadAction<string>> = (state, action) => {
  state.selectedProject = action.payload;
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
  state.hankeFilters.startDate = action.payload;
};

const setHankeFilterEndDate: CaseReducer<ReducerState, PayloadAction<string>> = (state, action) => {
  state.hankeFilters.endDate = action.payload;
};

const buildTilelayerState = (id: MapTileLayerId, visible: boolean): MapTilelayerState => ({
  id,
  visible,
});

const initialState: ReducerState = {
  status: '',
  error: '',
  selectedProject: null,
  drawGeometry: null,
  visibleLayers: [],
  mapTileLayers: {
    [MAPTILES.ORTOKARTTA]: buildTilelayerState(MAPTILES.ORTOKARTTA, false),
    [MAPTILES.KANTAKARTTA]: buildTilelayerState(MAPTILES.KANTAKARTTA, true),
  },
  hankeFilters: {
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear + 1}-12-31`,
  },
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    selectProject,
    updateDrawGeometry,
    toggleMapTileLayer,
    setHankeFilterStartDate,
    setHankeFilterEndDate,
  },
  extraReducers: (builder) => {
    builder.addCase(saveGeometryData.pending, (state) => {
      state.status = 'loading';
    });
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
