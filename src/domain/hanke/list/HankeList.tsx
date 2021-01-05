import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import Locale from '../../../common/components/locale/Locale';
import { getProjects } from './selectors';
import { actions } from './reducer';
import { useProjects } from '../../map/hooks/useProjects';
import H1 from '../../../common/components/text/H1';

import './Hankelista.styles.scss';

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { projects } = useProjects();
  const count = useSelector(getProjects);

  const incrementByOne = () => dispatch(actions.increment(1));

  return (
    <div className="hankelista">
      <H1 stylesAs="h2">{t('hankeList:pageHeader')}</H1>
      <div className="hankelista__inner">
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
      </div>{' '}
    </div>
  );
};

export default Projects;
