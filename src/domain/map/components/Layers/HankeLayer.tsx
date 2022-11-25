import React, { useRef, useEffect, useMemo, useContext } from 'react';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import { byAllHankeFilters } from '../../utils';
import { useDateRangeFilter } from '../../hooks/useDateRangeFilter';
import { styleFunction } from '../../utils/geometryStyle';
import CenterProjectOnMap from '../interations/CenterProjectOnMap';
import HankkeetContext from '../../HankkeetProviderContext';
import HighlightFeatureOnMap from '../interations/HighlightFeatureOnMap';

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

  useEffect(() => {
    hankeSource.current.clear();
    hankkeetFilteredByAll.forEach((hanke) => {
      const hankeFeatures = hanke.alueet.flatMap((alue) =>
        new GeoJSON().readFeatures(alue.geometriat.featureCollection)
      );
      hankeFeatures.forEach((feature) => {
        feature.setProperties(
          {
            liikennehaittaindeksi: hanke.liikennehaittaindeksi
              ? hanke.liikennehaittaindeksi.indeksi
              : null,
          },
          true
        );
      });
      hankeSource.current.addFeatures(hankeFeatures);
    });
    hankeSource.current.dispatchEvent('featuresAdded');
  }, [hankkeetFilteredByAll]);

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
