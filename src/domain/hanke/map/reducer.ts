import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import projectsJSON from '../../../mocks/projects.json';
import { HankeGeoJSON } from '../common/types/Hanke';

type State = {
  projects: HankeGeoJSON;
  selectedProject: null | string;
};

const selectProject: CaseReducer<State, PayloadAction<string>> = (state, action) => {
  state.selectedProject = action.payload;
};

const initialState: State = {
  projects: projectsJSON.louhiProjects as HankeGeoJSON,
  selectedProject: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    selectProject,
  },
});

export const { actions } = mapSlice;

export default mapSlice.reducer;
