import React from 'react';
import { useQuery } from 'react-query';
import api from '../../api/api';
import { HankeData } from '../../types/hanke';
import HankePortfolioComponent from './HankePortfolioComponent';
import { usePermissionsByHanke } from '../hankeUsers/hooks/useUserRightsForHanke';

const getHankkeet = async () => {
  const { data } = await api.get<HankeData[]>(`/hankkeet`, {
    params: {
      geometry: true,
    },
  });
  return data;
};

const useHankeList = () => useQuery<HankeData[]>(['project'], getHankkeet);

const HankePortfolioContainer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { data: hankkeet } = useHankeList();
  const { data: signedInUserByHanke } = usePermissionsByHanke();
  const userData = signedInUserByHanke ?? {};

  // Add header to fix Axe "page-has-heading-one"-error
  return hankkeet ? (
    <HankePortfolioComponent hankkeet={hankkeet} signedInUserByHanke={userData} />
  ) : (
    <></>
  );
};

export default HankePortfolioContainer;
