import React, { useRef, useMemo, useContext } from 'react';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import { byAllHankeFilters } from '../../utils';
import { useDateRangeFilter } from '../../hooks/useDateRangeFilter';
import { styleFunction } from '../../utils/geometryStyle';
import CenterProjectOnMap from '../interations/CenterProjectOnMap';
import HankkeetContext from '../../HankkeetProviderContext';
import HighlightFeatureOnMap from '../interations/HighlightFeatureOnMap';
import useHankeFeatures from '../../hooks/useHankeFeatures';

const HankeLayer = () => {
  const { hankkeet } = useContext(HankkeetContext);
  const hankeSource = useRef(new VectorSource());
  const { hankeFilterStartDate, hankeFilterEndDate } = useDateRangeFilter();

  const hankkeetFilteredByAll = useMemo(
    () =>
      hankkeet.filter(
        byAllHankeFilters({ startDate: hankeFilterStartDate, endDate: hankeFilterEndDate })
      ),
    [hankkeet, hankeFilterStartDate, hankeFilterEndDate]
  );

  useHankeFeatures(hankeSource.current, hankkeetFilteredByAll);

  return (
    <>
      <div style={{ display: 'none' }} data-testid="countOfFilteredHankkeet">
        {hankkeetFilteredByAll.length}
      </div>
      <CenterProjectOnMap source={hankeSource.current} />
      <HighlightFeatureOnMap source={hankeSource.current} />

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
