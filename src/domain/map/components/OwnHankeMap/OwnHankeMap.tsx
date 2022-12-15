import React, { useRef } from 'react';
import VectorSource from 'ol/source/Vector';
import Map from '../../../../common/components/map/Map';
import Kantakartta from '../Layers/Kantakartta';
import { HankeData } from '../../../types/hanke';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import { styleFunction } from '../../utils/geometryStyle';
import FitSource from '../interations/FitSource';
import useHankeFeatures from '../../hooks/useHankeFeatures';
import styles from './OwnHankeMap.module.scss';

type Props = {
  hanke: HankeData;
};

const OwnHankeMap: React.FC<Props> = ({ hanke }) => {
  const hankeSource = useRef(new VectorSource());
  useHankeFeatures(hankeSource.current, [hanke]);

  return (
    <div className={styles.mapContainer}>
      <Map zoom={9} mapClassName={styles.mapContainer__inner} showAttribution={false}>
        <Kantakartta />
        <VectorLayer
          source={hankeSource.current}
          zIndex={100}
          className="hankeGeometryLayer"
          style={styleFunction}
        />
        <FitSource source={hankeSource.current} />
      </Map>
    </div>
  );
};

export default OwnHankeMap;
