import React, { useRef, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Fill, Stroke, Style } from 'ol/style';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import { byAllHankeFilters } from '../../utils';
import { useDateRangeFilter } from '../../hooks/useDateRangeFilter';
import { HankeData } from '../../../types/hanke';
import api from '../../../api/api';

import CenterProjectOnMap from '../interations/CenterProjectOnMap';

// Temporary reference style implementation. Actual colors
// are chosen based on törmäysanalyysi
const geometryStyle = {
  Blue: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(36, 114, 198, 1)',
    }),
  }),
};

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
        style={geometryStyle.Blue}
      />
    </>
  );
};

export default HankeLayer;
