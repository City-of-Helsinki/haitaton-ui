import React from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { HankeData } from '../../../types/hanke';
import api from '../../../api/api';
import HankeSidebar from './HankeSidebar';

const getHanke = async (hankeTunnus: string | null) => {
  const response = await api.get<HankeData>(`/hankkeet/${hankeTunnus}`);
  return response;
};

const useGetHanke = (hankeTunnus: string | null) =>
  useQuery(['hanke', hankeTunnus], () => getHanke(hankeTunnus), {
    enabled: !!hankeTunnus,
    refetchOnWindowFocus: false,
    retry: false,
  });

type Props = {
  hankeTunnus?: string;
};

const HankeSidebarContainer: React.FC<Props> = ({ hankeTunnus }) => {
  const location = useLocation();
  const hanke = hankeTunnus || new URLSearchParams(location.search).get('hanke');
  const { isLoading, isError, data } = useGetHanke(hanke);

  if (!data || isLoading || isError) {
    return <p>Loading....</p>;
  }

  return <HankeSidebar hanke={data.data} />;
};

export default HankeSidebarContainer;
