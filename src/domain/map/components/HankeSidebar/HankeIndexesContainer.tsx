import React from 'react';
import { useQuery } from 'react-query';
import { HankeIndexData } from '../../../types/hanke';
import api from '../../../api/api';
import HankeIndexes from './HankeIndexes';

const getHankeIndexes = async (hankeTunnus: string | null) => {
  const response = await api.get<HankeIndexData>(`/hankkeet/${hankeTunnus}/tormaystarkastelu`);
  return response;
};

const useGetHanke = (hankeTunnus: string | null) =>
  useQuery(['hankeIndexes', hankeTunnus], () => getHankeIndexes(hankeTunnus), {
    enabled: !!hankeTunnus,
    refetchOnWindowFocus: false,
    retry: false,
  });

type Props = {
  hankeTunnus: string;
};

const HankeIndexesContainer: React.FC<Props> = ({ hankeTunnus }) => {
  const { isLoading, isError, data } = useGetHanke(hankeTunnus);

  if (!data || !data.data || isLoading || isError) {
    return null;
  }

  return <HankeIndexes hankeIndexData={data.data} />;
};

export default HankeIndexesContainer;
