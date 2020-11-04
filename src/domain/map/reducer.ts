import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import projectsJSON from '../../mocks/projects.json';
import intersectJSON from '../../mocks/intersect.json';
import { HankeGeoJSON, AnyPropertyGeoJSON } from '../hanke/common/types/Hanke';
import { MapDatalayer, MapDatalayerState } from './types';
import { DATALAYERS } from './constants';

type State = {
  projects: HankeGeoJSON;
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

const toggleLayer: CaseReducer<State, PayloadAction<MapDatalayer>> = (state, action) => {
  state.dataLayers[action.payload].visible = !state.dataLayers[action.payload].visible;
};

const buildDatalayerState = (data: AnyPropertyGeoJSON): MapDatalayerState => ({
  data,
  visible: true,
});

const initialState: State = {
  projects: projectsJSON.louhiProjects as HankeGeoJSON,
  selectedProject: null,
  visibleLayers: [],
  dataLayers: {
    [DATALAYERS.RESTAURANTS]: buildDatalayerState(
      intersectJSON.restaurantsGeoJSON as AnyPropertyGeoJSON
    ),
    [DATALAYERS.ROADS]: buildDatalayerState(intersectJSON.roadsGeoJSON as AnyPropertyGeoJSON),
    [DATALAYERS.CYCLING_ROADS]: buildDatalayerState(
      intersectJSON.cyclingRoadsGeoJSON as AnyPropertyGeoJSON
    ),
    [DATALAYERS.GREENERY]: buildDatalayerState(intersectJSON.greeneryGeoJSON as AnyPropertyGeoJSON),
  },
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    selectProject,
    toggleLayer,
  },
});

export const { actions } = mapSlice;

export default mapSlice.reducer;
