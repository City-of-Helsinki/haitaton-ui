import React from 'react';
import { useQuery } from 'react-query';
import { HankeData } from '../types/hanke';
import api from '../api/api';
import HankeMap from './HankeMap';

const getProjectsWithGeometry = async () => {
  const response = await api.get<HankeData[]>('/hankkeet', {
    params: {
      geometry: true,
    },
  });
  return response;
};

const useProjectsWithGeometry = () => useQuery(['projectsWithGeometry'], getProjectsWithGeometry);

const HankeMapContainer: React.FC = () => {
  const { data } = useProjectsWithGeometry();
  const projectsData = data ? data.data : [];

  return <HankeMap projectsData={projectsData} />;
};

export default HankeMapContainer;
