import React, { useRef } from 'react';
import VectorSource from 'ol/source/Vector';
import { FeatureLike } from 'ol/Feature';
import Map from '../../../../common/components/map/Map';
import Kantakartta from '../Layers/Kantakartta';
import { HankeData } from '../../../types/hanke';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import { styleFunction } from '../../utils/geometryStyle';
import FitSource from '../interations/FitSource';
import useHankeFeatures from '../../hooks/useHankeFeatures';
import styles from './OwnHankeMap.module.scss';
import { Application } from '../../../application/types/application';
import useApplicationFeatures from '../../hooks/useApplicationFeatures';

type Props = {
  hanke: HankeData;
  application?: Application;
};

const OwnHankeMap: React.FC<Props> = ({ hanke, application }) => {
  const hankeSource = useRef(new VectorSource());
  useHankeFeatures(hankeSource.current, [hanke]);

  const applicationSource = useRef(new VectorSource());
  useApplicationFeatures(applicationSource.current, application?.applicationData.areas);

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

        <VectorLayer
          source={applicationSource.current}
          zIndex={105}
          className="applicationGeometryLayer"
          style={(feature: FeatureLike) => styleFunction(feature, undefined, true)}
        />
        <FitSource source={hankeSource.current} />
      </Map>
    </div>
  );
};

export default OwnHankeMap;
