import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk } from '../../common/components/app/store';
import projectsJSON from '../../mocks/projects.json';
import intersectJSON from '../../mocks/intersect.json';
import { HankeGeoJSON, CommonGeoJSON } from '../../common/types/hanke';
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

const success: CaseReducer<State, PayloadAction<string>> = (state, action) => {
  state.status = action.payload;
};

const error: CaseReducer<State, PayloadAction<string>> = (state, action) => {
  state.error = action.payload;
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
    success,
    error,
  },
});

export const { actions } = mapSlice;

export default mapSlice.reducer;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// eslint-disable-next-line
const getRepoDetails = async (orc: string, repo: string) => {
  await sleep(500);
  return `${orc}-${repo}`;
};

export const fetchIssuesCount = (org: string, repo: string): AppThunk => async (dispatch) => {
  try {
    console.log("'foo");
    const repoDetails = await getRepoDetails(org, repo);
    dispatch(actions.success(repoDetails));
  } catch (err) {
    dispatch(actions.error(err.toString()));
  }
};
