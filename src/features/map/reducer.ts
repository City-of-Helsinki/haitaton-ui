import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import projectsJSON from '../../mocks/projects.json';

// https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/geojson/index.d.ts
export interface IGeometry {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coordinates: any;
}

export interface IGeoJson {
  type: string;
  geometry: IGeometry;
  bbox?: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const { actions } = mapSlice;

export default mapSlice.reducer;

export const getProjects = () => (state: { map: State }) => state.map.projects;

export const getSelectedProjectId = () => (state: { map: State }) => state.map.selectedProject;

export const getProjectById = (id: string | null) => (state: { map: State }) =>
  id ? state.map.projects.features.find((feature) => feature.properties.id === id) : null;
