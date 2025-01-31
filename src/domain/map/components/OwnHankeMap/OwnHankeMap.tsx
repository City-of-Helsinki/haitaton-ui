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
import { ApplicationArea, Tyoalue } from '../../../application/types/application';
import useApplicationFeatures from '../../hooks/useApplicationFeatures';
import { useTranslation } from 'react-i18next';
import FeatureInfoOverlay from '../FeatureInfoOverlay/FeatureInfoOverlay';
import { OverlayProps } from '../../../../common/components/map/types';
import AreaOverlay from '../AreaOverlay/AreaOverlay';
import DrawProvider from '../../../../common/components/map/modules/draw/DrawProvider';

type Props = {
  hanke: HankeData;
  tyoalueet?: ApplicationArea[] | Tyoalue[];
};

const OwnHankeMap: React.FC<Props> = ({ hanke, tyoalueet }) => {
  const { t } = useTranslation();

  const hankeSource = useRef(new VectorSource());
  useHankeFeatures(hankeSource.current, [hanke], false);

  const applicationSource = useRef(new VectorSource());
  useApplicationFeatures(applicationSource.current, t, tyoalueet);

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

        <FitSource source={tyoalueet?.length ? applicationSource.current : hankeSource.current} />

        <DrawProvider source={applicationSource.current}>
          <FeatureInfoOverlay
            render={(feature) => {
              const overlayProperties = feature?.get('overlayProps') as OverlayProps | undefined;
              return <AreaOverlay overlayProps={overlayProperties} />;
            }}
            all={true}
          />
        </DrawProvider>
      </Map>
    </div>
  );
};

export default OwnHankeMap;
