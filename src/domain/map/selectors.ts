import { RootState } from '../../common/redux/store';

export const getSelectedProjectId = () => (state: RootState) => state.map.selectedProject;

export const getMapTileLayers = () => (state: RootState) => state.map.mapTileLayers;

export const getStatus = () => (state: RootState) => state.map.status;

export const getDrawGeometry = () => (state: RootState) => state.map.drawGeometry;

export const getHankeFilterStartDate = () => (state: RootState) => state.map.hankeFilters.startDate;

export const getHankeFilterEndDate = () => (state: RootState) => state.map.hankeFilters.endDate;
