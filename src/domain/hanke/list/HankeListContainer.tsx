import React from 'react';
import { useQuery } from 'react-query';
import HankeListComponent from './HankeListComponent';
import api from '../../api/api';
import { HankeDataDraft } from '../../types/hanke';

const getHankkeet = async () => {
  const { data } = await api.get<HankeDataDraft[]>(`/hankkeet/`);
  return data;
};

const useHankeList = () => useQuery<HankeDataDraft[]>(['project'], getHankkeet);

const HankeListContainer: React.FC = () => {
  const { data } = useHankeList();

  return data ? <HankeListComponent initialData={data} /> : null;
};

export default HankeListContainer;
