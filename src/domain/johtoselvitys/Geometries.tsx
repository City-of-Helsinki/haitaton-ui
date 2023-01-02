import React, { useEffect, useState } from 'react';
import VectorSource from 'ol/source/Vector';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import VectorLayer from '../../common/components/map/layers/VectorLayer';
import Map from '../../common/components/map/Map';
import FitSource from '../map/components/interations/FitSource';
import Kantakartta from '../map/components/Layers/Kantakartta';
import styles from './Geometries.module.scss';
import Controls from '../../common/components/map/controls/Controls';
import DrawModule from '../../common/components/map/modules/draw/DrawModule';
import { formatFeaturesToAlluGeoJSON } from '../map/utils';
import Text from '../../common/components/text/Text';
import ResponsiveGrid from '../../common/components/grid/ResponsiveGrid';
import DatePicker from '../../common/components/datePicker/DatePicker';
import useLocale from '../../common/hooks/useLocale';

export const initialValues = {
  geometriat: null,
};

export const Geometries: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { setValue } = useFormContext();
  const [drawSource] = useState<VectorSource>(new VectorSource());

  useEffect(() => {
    function onDrawChange() {
      const hankeGeometries = formatFeaturesToAlluGeoJSON(drawSource.getFeatures());

      setValue('applicationData.geometry', hankeGeometries);
    }

    drawSource.on('addfeature', onDrawChange);
    drawSource.on('removefeature', onDrawChange);
    drawSource.on('changefeature', onDrawChange);

    return function cleanup() {
      drawSource.un('addfeature', onDrawChange);
      drawSource.un('removefeature', onDrawChange);
      drawSource.un('changefeature', onDrawChange);
    };
  }, [drawSource, setValue]);

  function convertDate(value: string, valueAsDate: Date) {
    return valueAsDate.getTime();
  }

  return (
    <div>
      <Text tag="p" spacingBottom="m">
        {t('form:requiredInstruction')}
      </Text>

      <Text tag="h2" styleAs="h4" weight="bold" spacingBottom="s">
        {t('form:headers:alueet')}
      </Text>

      <ResponsiveGrid>
        <DatePicker
          name="applicationData.startTime"
          label="Työn arvioitu alkupäivä"
          locale={locale}
          required
          dateConvertFunction={convertDate}
        />
        <DatePicker
          name="applicationData.endTime"
          label="Työn arvioitu loppupäivä"
          locale={locale}
          required
          dateConvertFunction={convertDate}
        />
      </ResponsiveGrid>

      <div className={styles.mapContainer}>
        <Map zoom={9} mapClassName={styles.mapContainer__inner}>
          <Kantakartta />

          <VectorLayer source={drawSource} zIndex={100} className="drawLayer" />

          <FitSource source={drawSource} />

          <Controls>
            <DrawModule source={drawSource} />
          </Controls>
        </Map>
      </div>
    </div>
  );
};
export default Geometries;
