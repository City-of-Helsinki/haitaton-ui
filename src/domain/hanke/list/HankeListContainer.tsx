import React from 'react';
import { useQuery } from 'react-query';

import HankeListComponent from './HankeListComponent';

import api from '../../../common/utils/api';

const getProjects = async () => {
  const data = await api.get(`/hankkeet/`);
  return data;
};

const useProject = () => useQuery(['project'], getProjects);
// eslint-disable-next-line
const Projects: React.FC = () => {
  const { data } = useProject();

  return <HankeListComponent initialData={data} />;
};

export default Projects;
