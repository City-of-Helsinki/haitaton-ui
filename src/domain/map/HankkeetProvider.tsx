import React from 'react';
import { useQuery } from 'react-query';
import api from '../api/api';
import HankkeetContext from './HankkeetProviderContext';
import { HankeData } from '../types/hanke';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertArrayToObject = (array: any[], key: string) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

const HankkeetProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const getProjectsWithGeometry = async () => {
    const response = await api.get<HankeData[]>('/public-hankkeet', {
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
  const hankkeetObject = data ? convertArrayToObject(data.data, 'hankeTunnus') : {};

  return (
    <HankkeetContext.Provider value={{ hankkeet: projectsData, hankkeetObject }}>
      {children}
    </HankkeetContext.Provider>
  );
};

export default HankkeetProvider;
