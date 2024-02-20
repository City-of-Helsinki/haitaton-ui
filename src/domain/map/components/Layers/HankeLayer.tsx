import { useRef, useMemo, useContext } from 'react';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import { byAllHankeFilters } from '../../utils';
import { styleFunction } from '../../utils/geometryStyle';
import CenterProjectOnMap from '../interations/CenterProjectOnMap';
import HankkeetContext from '../../HankkeetProviderContext';
import HighlightFeatureOnMap from '../interations/HighlightFeatureOnMap';
import useHankeFeatures from '../../hooks/useHankeFeatures';
import { HankeData } from '../../../types/hanke';

type Props = {
  hankeData?: HankeData[];
  startDate?: string | null;
  endDate?: string | null;
  centerOnMap?: boolean;
  highlightFeatures?: boolean;
};

const currentYear = new Date().getFullYear();

function HankeLayer({
  hankeData,
  startDate = `${currentYear}-01-01`,
  endDate = `${currentYear + 1}-12-31`,
  centerOnMap = false,
  highlightFeatures = false,
}: Readonly<Props>) {
  const { hankkeet: hankkeetFromContext } = useContext(HankkeetContext);
  const hankeSource = useRef(new VectorSource());
  const hankkeet = hankeData || hankkeetFromContext;

  const hankkeetFilteredByAll = useMemo(
    () => hankkeet.filter(byAllHankeFilters({ startDate, endDate })),
    [hankkeet, startDate, endDate],
  );

  useHankeFeatures(hankeSource.current, hankkeetFilteredByAll);

  return (
    <>
      <div style={{ display: 'none' }} data-testid="countOfFilteredHankkeet">
        {hankkeetFilteredByAll.length}
      </div>
      {centerOnMap && <CenterProjectOnMap source={hankeSource.current} />}
      {highlightFeatures && <HighlightFeatureOnMap source={hankeSource.current} />}

      <VectorLayer
        source={hankeSource.current}
        zIndex={100}
        className="hankeGeometryLayer"
        style={styleFunction}
      />
    </>
  );
}

export default HankeLayer;
