import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();
  const history = useHistory();
  const hanke = hankeTunnus || new URLSearchParams(location.search).get('hanke');
  const { isLoading, isError, data } = useGetHanke(hanke);

  useEffect(() => {
    setIsOpen(true);
  }, [hanke]);

  const handleClose = () => {
    setIsOpen(false);
    history.push(location.pathname);
  };

  if (!data || isLoading || isError) {
    return null;
  }

  return <HankeSidebar hanke={data.data} isOpen={isOpen} handleClose={handleClose} />;
};

export default HankeSidebarContainer;
