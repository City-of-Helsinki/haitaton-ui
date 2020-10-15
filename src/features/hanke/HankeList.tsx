import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Locale from '../../common/components/locale/Locale';
import { getProjects, actions } from './reducer';

const Projects: React.FC = () => {
  const dispatch = useDispatch();
  const count = useSelector(getProjects);

  const incrementByOne = () => dispatch(actions.increment(1));

  return (
    <div>
      {count}
      <button onClick={() => incrementByOne()} type="button">
        <Locale id="common:increment" />
      </button>
    </div>
  );
};

export default Projects;
