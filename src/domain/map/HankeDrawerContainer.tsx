import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import api from '../../common/utils/api';
import { HankeGeometria } from '../types/hanke';
import HankeDrawer from './HankeDrawer';

type HankeTunnus = string | undefined;

type Props = {
  hankeTunnus: HankeTunnus;
  onChangeGeometries: () => void;
};

// enabled-config should prevent running this when hankeTunnus is undefined?
const getHankeGeometry = async (hankeTunnus: HankeTunnus) => {
  const { data } = await api.get<HankeGeometria>(`/hankkeet/${hankeTunnus}/geometriat`);
  return data;
};

const useHankeGeometry = (hankeTunnus: HankeTunnus) =>
  useQuery<HankeGeometria>(['hankeGeometry', hankeTunnus], () => getHankeGeometry(hankeTunnus), {
    retry: false,
    enabled: !!hankeTunnus,
  });

const HankeDrawerContainer: React.FC<Props> = ({ hankeTunnus, onChangeGeometries }) => {
  const queryClient = useQueryClient();
  const [isGeometryChanged, setIsGeometryChanged] = useState(false);
  const { data } = useHankeGeometry(hankeTunnus);

  // Invalidate cache when unmounting and geometry is changed
  // Otherwise, previous geometry will shown when changing pages
  useEffect(() => {
    return () => {
      if (isGeometryChanged) {
        queryClient.invalidateQueries(['hankeGeometry', hankeTunnus]);
      }
    };
  }, [queryClient, isGeometryChanged]);

  // Update local state and form
  const handleChangeAndInvalidateCache = useCallback(() => {
    setIsGeometryChanged(true);
    onChangeGeometries();
  }, []);

  return (
    <HankeDrawer
      onChangeGeometries={handleChangeAndInvalidateCache}
      geometry={data ? data.featureCollection : undefined}
    />
  );
};

export default HankeDrawerContainer;
