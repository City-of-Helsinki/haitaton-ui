/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import VectorLayer from '../../../common/components/map/layers/VectorLayer';
import Map from '../../../common/components/map/Map';
import FitSource from '../../map/components/interations/FitSource';
import Kantakartta from '../../map/components/Layers/Kantakartta';
import Ortokartta from '../../map/components/Layers/Ortokartta';
import { useMapDataLayers } from '../../map/hooks/useMapLayers';
import { HakemusFormValues } from './types';
import styles from './Geometries.module.scss';
import Controls from '../../../common/components/map/controls/Controls';
import DrawModule from '../../../common/components/map/modules/draw/DrawModule';
import { formatFeaturesToHankeGeoJSON } from '../../map/utils';

export const initialValues = {
  geometriat: null,
};

export const Geometries: React.FC = () => {
  const formik = useFormikContext<HakemusFormValues>();
  const [drawSource] = useState<VectorSource>(new VectorSource());
  const { mapTileLayers } = useMapDataLayers();
  const [features, setFeatures] = useState<Feature<Geometry>[]>([]);

  const onDrawChange = () => {
    setFeatures(drawSource.getFeatures());
    const hankeGeometries = formatFeaturesToHankeGeoJSON(drawSource.getFeatures());
    formik.setFieldValue('geometriat', hankeGeometries);
    // Backend ei kuitenkaan vielä huoli ylläolevan mukaista geometrioiden tallennusta
  };

  useEffect(() => {
    drawSource.on('addfeature', () => onDrawChange());
    drawSource.on('removefeature', () => onDrawChange());
    drawSource.on('changefeature', () => onDrawChange());
  }, []);

  return (
    <div>
      <div className={styles.mapContainer} style={{ width: '100%', height: 500 }}>
        <Map zoom={9} mapClassName={styles.mapContainer__inner}>
          {mapTileLayers.kantakartta.visible && <Kantakartta />}
          {mapTileLayers.ortokartta.visible && <Ortokartta />}
          <VectorLayer source={drawSource} zIndex={100} className="drawLayer" />

          <FitSource source={drawSource} />

          <Controls>
            <DrawModule source={drawSource} />
          </Controls>
        </Map>
      </div>
      {features.map((feature) => {
        const featureGeometry = feature.getGeometry();
        return <p>{JSON.stringify(featureGeometry)}</p>;
      })}
      <p>{JSON.stringify(formik.values.geometriat)}</p>
    </div>
  );
};
export default Geometries;
