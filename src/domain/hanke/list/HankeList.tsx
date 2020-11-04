import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Locale from '../../../common/components/locale/Locale';
import { getProjects } from './selectors';
import { actions } from './reducer';
import { useProjects } from '../../map/hooks/useProjects';

const Projects: React.FC = () => {
  const dispatch = useDispatch();
  const { projects } = useProjects();
  const count = useSelector(getProjects);

  const incrementByOne = () => dispatch(actions.increment(1));

  return (
    <div>
      <h1>Hankesalkku</h1>

      <ul>
        {projects.features.map((project) => (
          <li key={`${project.properties.id}-${project.properties.name}`}>
            {project.properties.name}
          </li>
        ))}
      </ul>

      <h3>Test</h3>
      {count}
      <button onClick={() => incrementByOne()} type="button">
        <Locale id="common:increment" />
      </button>
    </div>
  );
};

export default Projects;
