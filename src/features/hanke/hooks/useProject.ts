import { useSelector, useDispatch } from 'react-redux';
import { actions, getProjectById, getSelectedProjectId } from '../../map/reducer';

export const useProject = () => {
  const dispatch = useDispatch();
  const selectedProjectId = useSelector(getSelectedProjectId());
  const project = useSelector(getProjectById(selectedProjectId));

  const selectProject = (projectId: string) => dispatch(actions.selectProject(projectId));

  return { project, selectedProjectId, selectProject };
};
