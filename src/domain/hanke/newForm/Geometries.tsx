import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { useTranslation } from 'react-i18next';
import { useAsyncDebounce } from 'react-table';
import VectorLayer from '../../../common/components/map/layers/VectorLayer';
import Map from '../../../common/components/map/Map';
import FitSource from '../../map/components/interations/FitSource';
import Kantakartta from '../../map/components/Layers/Kantakartta';
import Ortokartta from '../../map/components/Layers/Ortokartta';
import { useMapDataLayers } from '../../map/hooks/useMapLayers';
import { HakemusFormValues, HankeGeometria } from './types';
import styles from './Geometries.module.scss';
import Controls from '../../../common/components/map/controls/Controls';
import DrawModule from '../../../common/components/map/modules/draw/DrawModule';
import { formatFeaturesToHankeGeoJSON } from '../../map/utils';
import api from '../../api/api';
import { HankeGeoJSON } from '../../../common/types/hanke';
import Text from '../../../common/components/text/Text';
import { Haitat } from './Haitat';

export const initialValues = {
  geometriat: null,
};

export const Geometries: React.FC = () => {
  const { t } = useTranslation();
  const formik = useFormikContext<HakemusFormValues>();
  const [drawSource] = useState<VectorSource>(new VectorSource());
  const { mapTileLayers } = useMapDataLayers();
  const [geometry, setGeometry] = useState<HankeGeoJSON | null>(null);

  const onDrawChange = () => {
    const hankeGeometries = formatFeaturesToHankeGeoJSON(drawSource.getFeatures());
    formik.setFieldValue('geometriat', hankeGeometries);
  };

  const onDrawChangeDebounced = useAsyncDebounce(onDrawChange, 500);

  useEffect(() => {
    drawSource.on('addfeature', onDrawChange);
    drawSource.on('removefeature', onDrawChange);
    drawSource.on('changefeature', onDrawChangeDebounced);

    if (formik.values.hankeTunnus) {
      api
        .get<HankeGeometria>(`hankkeet/${formik.values.hankeTunnus}/geometriat`)
        .then((data) => {
          setGeometry(data.data.featureCollection);
        })
        .catch(() => {
          // eslint-disable-next-line
        });
    }

    return () => {
      drawSource.un('addfeature', onDrawChange);
      drawSource.un('removefeature', onDrawChange);
      drawSource.un('changefeature', onDrawChangeDebounced);
    };
  }, [formik.values.hankeTunnus]);

  useEffect(() => {
    if (geometry && geometry.features.length > 0) {
      drawSource.clear();
      drawSource.addFeatures(new GeoJSON().readFeatures(geometry));
    }
  }, [geometry]);

  return (
    <div>
      <Text tag="h1" spacing="s" weight="bold" styleAs="h3">
        {t('hankeForm:hankkeenAlueForm:header')}
      </Text>
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

      <Haitat />
    </div>
  );
};
export default Geometries;
