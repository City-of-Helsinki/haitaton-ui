import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../reducer';
import { getProjectById, getSelectedProjectId } from '../selectors';

export const useProject = () => {
  const dispatch = useDispatch();
  const selectedProjectId = useSelector(getSelectedProjectId());
  const project = useSelector(getProjectById(selectedProjectId));

  const selectProject = (projectId: string) => dispatch(actions.selectProject(projectId));

  return { project, selectedProjectId, selectProject };
};
