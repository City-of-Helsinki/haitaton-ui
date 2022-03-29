import React from 'react';
import { useQuery } from 'react-query';
import HankeListComponent from './HankeListComponent';
import api from '../../api/api';
import { HankeData } from '../../types/hanke';

const getHankkeet = async () => {
  const { data } = await api.get<HankeData[]>(`/public-hankkeet`);
  return data;
};

const useHankeList = () => useQuery<HankeData[]>(['project'], getHankkeet);

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
