import { useRef, useMemo, useContext } from 'react';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import { hankeIsBetweenDates } from '../../utils';
import { styleFunction } from '../../utils/geometryStyle';
import CenterProjectOnMap from '../interations/CenterProjectOnMap';
import HankkeetContext from '../../HankkeetProviderContext';
import HighlightFeatureOnMap from '../interations/HighlightFeatureOnMap';
import useHankeFeatures from '../../hooks/useHankeFeatures';
import { HankeData } from '../../../types/hanke';
import { toStartOfDayUTCISO } from '../../../../common/utils/date';
import FitSource from '../interations/FitSource';

type Props = {
  hankeData?: HankeData[];
  startDate?: string | null;
  endDate?: string | null;
  centerOnMap?: boolean;
  highlightFeatures?: boolean;
  fitSource?: boolean;
};

const currentYear = new Date().getFullYear();

function HankeLayer({
  hankeData,
  startDate = `${currentYear}-01-01`,
  endDate = `${currentYear + 1}-12-31`,
  centerOnMap = false,
  highlightFeatures = false,
  fitSource = false,
}: Readonly<Props>) {
  const { hankkeet: hankkeetFromContext } = useContext(HankkeetContext);
  const hankeSource = useRef(new VectorSource());
  const hankkeet = hankeData || hankkeetFromContext;

  const hankkeetFilteredByDates = useMemo(
    () =>
      hankkeet.map((hanke) => ({
        ...hanke,
        alueet: hanke.alueet.filter((alue) =>
          hankeIsBetweenDates({
            startDate: startDate && toStartOfDayUTCISO(new Date(startDate)),
            endDate,
          })({
            startDate: alue.haittaAlkuPvm?.toString() ?? null,
            endDate: alue.haittaLoppuPvm?.toString() ?? null,
          }),
        ),
      })),
    [hankkeet, startDate, endDate],
  );

  useHankeFeatures(hankeSource.current, hankkeetFilteredByDates);

  return (
    <>
      <div style={{ display: 'none' }} data-testid="countOfFilteredHankeAlueet">
        {hankkeetFilteredByDates.flatMap((hanke) => hanke.alueet).length}
      </div>
      {centerOnMap && <CenterProjectOnMap source={hankeSource.current} />}
      {highlightFeatures && <HighlightFeatureOnMap source={hankeSource.current} />}
      {fitSource && <FitSource source={hankeSource.current} fitOnce />}

      <VectorLayer
        source={hankeSource.current}
        zIndex={1}
        className="hankeGeometryLayer"
        style={styleFunction}
      />
    </>
  );
}

export default HankeLayer;
