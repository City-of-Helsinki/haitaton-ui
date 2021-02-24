import React from 'react';
import { useQuery } from 'react-query';
import api from '../api/api';
import HankkeetContext from './HankkeetProviderContext';
import { HankeData } from '../types/hanke';

const HankkeetProvider: React.FC = ({ children }) => {
  const getProjectsWithGeometry = async () => {
    const response = await api.get<HankeData[]>('/hankkeet', {
      params: {
        geometry: true,
      },
    });
    return response;
  };

  const useProjectsWithGeometry = () =>
    useQuery(['projectsWithGeometry'], getProjectsWithGeometry, {
      refetchOnWindowFocus: false,
      retry: false,
    });

  const { data } = useProjectsWithGeometry();
  const projectsData = data ? data.data : [];

  return (
    <HankkeetContext.Provider value={{ hankkeet: projectsData }}>
      {children}
    </HankkeetContext.Provider>
  );
};

export default HankkeetProvider;
