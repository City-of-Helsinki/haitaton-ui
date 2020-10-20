import { RootState } from '../../../common/components/app/store';

export const getProjects = (state: RootState): number => state.projects;
