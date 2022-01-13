import React from 'react';
import { useQuery } from 'react-query';
import HankeListComponent from './HankeListComponent';
import api from '../../api/api';
import { HankeDataDraft } from '../../types/hanke';

const getHankkeet = async () => {
  const { data } = await api.get<HankeDataDraft[]>(`/hankkeet`);
  return data;
};

const useHankeList = () => useQuery<HankeDataDraft[]>(['project'], getHankkeet);

const HankeListContainer: React.FC = () => {
  const { data } = useHankeList();
  if (data) {
    data.sort((a, b) => {
      return -(a.id - b.id);
    });
  }

  // Add header to fix Axe "page-has-heading-one"-error
  return data ? <HankeListComponent projectsData={data} /> : <h1>Ladataan</h1>;
};

export default HankeListContainer;
