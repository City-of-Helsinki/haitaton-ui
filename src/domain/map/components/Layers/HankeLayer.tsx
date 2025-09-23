import { useRef, useMemo } from 'react';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import { styleFunction } from '../../utils/geometryStyle';
import CenterProjectOnMap from '../interations/CenterProjectOnMap';
import HighlightFeatureOnMap from '../interations/HighlightFeatureOnMap';
import useHankeFeatures from '../../hooks/useHankeFeatures';
import { HankeAlue, HankeData } from '../../../types/hanke';
import FitSource from '../interations/FitSource';

type Props = {
  hankeData?: HankeData[];
  centerOnMap?: boolean;
  highlightFeatures?: boolean;
  fitSource?: boolean;
  filterHankeAlueet?: (alueet: HankeAlue[]) => HankeAlue[];
};

function HankeLayer({
  hankeData,
  centerOnMap = false,
  highlightFeatures = false,
  fitSource = false,
  filterHankeAlueet,
}: Readonly<Props>) {
  const hankeSource = useRef(new VectorSource());
  hankeSource.current.set('sourceName', 'hankeSource');

  const hankkeetFilteredByDates = useMemo(() => {
    const hankkeet = hankeData || [];
    return hankkeet.map((hanke) => ({
      ...hanke,
      alueet: filterHankeAlueet ? filterHankeAlueet(hanke.alueet) : hanke.alueet,
    }));
  }, [hankeData, filterHankeAlueet]);

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
