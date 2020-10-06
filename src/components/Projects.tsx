import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getProjects, actions } from '../features/projects/reducer';

const Projects: React.FC = () => {
  const dispatch = useDispatch();
  const count = useSelector(getProjects);

  const incrementByOne = () => dispatch(actions.increment(1));

  return (
    <div>
      {count}
      <button onClick={() => incrementByOne()}>Increment</button>
    </div>
  );
};

export default Projects;
