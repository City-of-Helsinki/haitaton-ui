import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import projectsJSON from '../../mocks/projects.json';
import intersectJSON from '../../mocks/intersect.json';
import { HankeGeoJSON, CommonGeoJSON } from '../../common/types/hanke';
import { saveGeometryData } from './thunks';
import { MapDataLayerKey, MapDatalayerState } from './types';
import { DATALAYERS } from './constants';

type State = {
  projects: HankeGeoJSON;
  status: string;
  error: string;
  visibleLayers: string[];
  selectedProject: null | string;
  dataLayers: {
    [DATALAYERS.RESTAURANTS]: MapDatalayerState;
    [DATALAYERS.ROADS]: MapDatalayerState;
    [DATALAYERS.CYCLING_ROADS]: MapDatalayerState;
    [DATALAYERS.GREENERY]: MapDatalayerState;
  };
};

const selectProject: CaseReducer<State, PayloadAction<string>> = (state, action) => {
  state.selectedProject = action.payload;
};

const toggleLayer: CaseReducer<State, PayloadAction<MapDataLayerKey>> = (state, action) => {
  state.dataLayers[action.payload].visible = !state.dataLayers[action.payload].visible;
};

const buildDatalayerState = (key: MapDataLayerKey, data: CommonGeoJSON): MapDatalayerState => ({
  key,
  data,
  visible: false,
});

const initialState: State = {
  projects: projectsJSON.louhiProjects as HankeGeoJSON,
  status: '',
  error: '',
  selectedProject: null,
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
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    selectProject,
    toggleLayer,
  },
  extraReducers: (builder) => {
    builder.addCase(saveGeometryData.fulfilled, (state, { payload }) => {
      state.status = 'ok';
    });
    builder.addCase(saveGeometryData.rejected, (state, action) => {
      state.status = 'error';
      console.log({ action });
      /* if (action.payload) {
        // Since we passed in `MyKnownError` to `rejectValue` in `updateUser`, the type information will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error;
      } */
    });
  },
});

export const { actions, caseReducers } = mapSlice;

export default mapSlice.reducer;
