import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import api from '../api/api';
import HankkeetContext from './HankkeetProviderContext';
import { PublicHanke, toHankeData } from '../types/hanke';

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

const HankkeetProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const getPublicHankkeet = async () => {
    return await api.get<PublicHanke[]>('/public-hankkeet');
  };

  const usePublicHankkeet = () =>
    useQuery(['projectsWithGeometry'], getPublicHankkeet, {
      refetchOnWindowFocus: false,
      retry: false,
    });

  const { data } = usePublicHankkeet();
  const hankeData = useMemo(() => (data?.data ? data.data.map(toHankeData) : []), [data]);
  const hankkeetObject = useMemo(
    () => (data?.data ? convertArrayToObject(hankeData, 'hankeTunnus') : {}),
    [data?.data, hankeData],
  );
  const value = useMemo(
    () => ({ hankkeet: hankeData, hankkeetObject }),
    [hankeData, hankkeetObject],
  );

  return <HankkeetContext.Provider value={value}>{children}</HankkeetContext.Provider>;
};

export default HankkeetProvider;
