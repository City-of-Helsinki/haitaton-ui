import React from 'react';
import { useQuery } from 'react-query';
import { HankeData } from '../types/hanke';
import api from '../api/api';
import HankeMapComponent from './HankeMapComponent';

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
  const { isLoading, isError, data } = useProjectsWithGeometry();

  return (
    <HankeMapComponent
      loadingProjects={isLoading}
      loadingProjectsError={isError}
      projectsData={data}
    />
  );
};

export default HankeMapContainer;
