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

const HankeListContainer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { data, isLoading, isError } = useHankeList();
  if (data) {
    data.sort((a, b) => {
      return -(a.id - b.id);
    });
  }

  if (isLoading) {
    return <h1>Ladataan</h1>;
  }
  if (isError) {
    return <h1>Ladattaessa tapahtui virhe. Voit kokeilla kirjautua ulos ja takaisin uudelleen.</h1>;
  }
  if (data) {
    return <HankeListComponent projectsData={data} />;
  }
  return <h1>Ladataan</h1>;
};

export default HankeListContainer;
