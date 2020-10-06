import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import projectsJSON from '../../mocks/projects.json';

// https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/geojson/index.d.ts
export interface IGeometry {
  type: string;
  coordinates: any;
}

export interface IGeoJson {
  type: string;
  geometry: IGeometry;
  bbox?: number[];
  properties?: any;
}

type ProjectsList = {
  type: string;
  features: IGeoJson[];
};

type State = {
  projects: ProjectsList;
  selectedProject: null | string;
};

const selectProject: CaseReducer<State, PayloadAction<string>> = (state, action) => {
  state.selectedProject = action.payload;
};

const initialState: State = {
  projects: projectsJSON.louhiProjects,
  selectedProject: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    selectProject,
  },
});

export const actions = mapSlice.actions;

export default mapSlice.reducer;

export const getProjects = () => (state: { map: State }): any => state.map.projects;

export const getSelectedProjectId = () => (state: { map: State }): any => state.map.selectedProject;

export const getProjectById = (id: string) => (state: { map: State }): any =>
  state.map.projects.features.find((feature) => feature.properties.id === id);
