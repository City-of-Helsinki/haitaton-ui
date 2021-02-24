import React, { useRef, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import { byAllHankeFilters } from '../../utils';
import { useDateRangeFilter } from '../../hooks/useDateRangeFilter';
import { HankeData } from '../../../types/hanke';
import api from '../../../api/api';
import { styleFunction } from '../../utils/geometryStyle';
import CenterProjectOnMap from '../interations/CenterProjectOnMap';

const getProjectsWithGeometry = async () => {
  const response = await api.get<HankeData[]>('/hankkeet', {
    params: {
      geometry: true,
    },
  });
  return response;
};

const useProjectsWithGeometry = () =>
  useQuery(['projectsWithGeometry'], getProjectsWithGeometry, {
    refetchOnWindowFocus: false,
    retry: false,
  });

const HankeLayer = () => {
  const hankeSource = useRef(new VectorSource());
  const { hankeFilterStartDate, hankeFilterEndDate } = useDateRangeFilter();

  const { data } = useProjectsWithGeometry();
  const projectsData = data ? data.data : [];

  const hankkeetFilteredByAll = useMemo(
    () =>
      projectsData.filter(
        byAllHankeFilters({ startDate: hankeFilterStartDate, endDate: hankeFilterEndDate })
      ),
    [projectsData, hankeFilterStartDate, hankeFilterEndDate]
  );

  useEffect(() => {
    hankeSource.current.clear();
    hankkeetFilteredByAll.forEach((hanke) => {
      if (hanke.geometriat) {
        hankeSource.current.addFeatures(
          new GeoJSON().readFeatures(hanke.geometriat.featureCollection)
        );
      }
    });
    hankeSource.current.dispatchEvent('featuresAdded');
  }, [hankkeetFilteredByAll]);

  return (
    <>
      <div data-testid="countOfFilteredHankkeet">{hankkeetFilteredByAll.length}</div>
      <CenterProjectOnMap source={hankeSource.current} />

      <VectorLayer
        source={hankeSource.current}
        zIndex={100}
        className="hankeGeometryLayer"
        style={styleFunction}
      />
    </>
  );
};

export default HankeLayer;
