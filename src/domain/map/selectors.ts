import { RootState } from '../../common/redux/store';

export const getProjects = () => (state: RootState) => state.map.projects;

export const getSelectedProjectId = () => (state: RootState) => state.map.selectedProject;

export const getProjectById = (id: string | null) => (state: RootState) =>
  id ? state.map.projects.features.find((feature) => feature.properties.id === id) : null;

export const getMapDataLayers = () => (state: RootState) => state.map.dataLayers;

export const getStatus = () => (state: RootState) => state.map.status;

export const getGeometry = () => (state: RootState) => state.map.geometryData;
