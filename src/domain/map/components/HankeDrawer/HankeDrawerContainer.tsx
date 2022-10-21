import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import VectorSource from 'ol/source/Vector';
import { Coordinate } from 'ol/coordinate';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import api from '../../../api/api';
import { HankeGeometria } from '../../../types/hanke';
import HankeDrawer from './HankeDrawer';

type HankeTunnus = string | undefined;

type Props = {
  hankeTunnus: HankeTunnus;
  onChangeGeometries: (feature: Feature<Geometry>) => void;
  center?: Coordinate;
  drawSource?: VectorSource;
};

// enabled-config should prevent running this when hankeTunnus is undefined?
const getHankeGeometry = async (hankeTunnus: HankeTunnus) => {
  const { data } = await api.get<HankeGeometria>(`/hankkeet/${hankeTunnus}/geometriat`);
  return data;
};

const useHankeGeometry = (hankeTunnus: HankeTunnus) =>
  useQuery<HankeGeometria>(['hankeGeometry', hankeTunnus], () => getHankeGeometry(hankeTunnus), {
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!hankeTunnus,
  });

const HankeDrawerContainer: React.FC<Props> = ({
  hankeTunnus,
  onChangeGeometries,
  center,
  drawSource,
}) => {
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
  }, [queryClient, isGeometryChanged, hankeTunnus]);

  // Update local state and form
  const handleChangeAndInvalidateCache = useCallback(
    (geometry: Feature<Geometry>) => {
      setIsGeometryChanged(true);
      onChangeGeometries(geometry);
    },
    [onChangeGeometries]
  );

  return (
    <HankeDrawer
      onAddFeature={handleChangeAndInvalidateCache}
      geometry={data ? data.featureCollection : undefined}
      center={center}
      drawSource={drawSource}
    />
  );
};

const shouldNotUpdate = () => false;

export default React.memo(HankeDrawerContainer, shouldNotUpdate);
