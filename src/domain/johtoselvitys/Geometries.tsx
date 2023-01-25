import React, { useEffect, useRef, useState } from 'react';
import { Feature } from 'ol';
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import GeoJSON from 'ol/format/GeoJSON';
import GeometryCollection from 'ol/geom/GeometryCollection';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { Button, Fieldset, IconTrash, Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { debounce, sortBy, uniqueId } from 'lodash';
import VectorLayer from '../../common/components/map/layers/VectorLayer';
import Map from '../../common/components/map/Map';
import FitSource from '../map/components/interations/FitSource';
import Kantakartta from '../map/components/Layers/Kantakartta';
import styles from './Geometries.module.scss';
import Controls from '../../common/components/map/controls/Controls';
import DrawModule from '../../common/components/map/modules/draw/DrawModule';
import { formatFeaturesToAlluGeoJSON, formatSurfaceArea } from '../map/utils';
import Text from '../../common/components/text/Text';
import ResponsiveGrid from '../../common/components/grid/ResponsiveGrid';
import DatePicker from '../../common/components/datePicker/DatePicker';
import useLocale from '../../common/hooks/useLocale';
import OverviewMapControl from '../../common/components/map/controls/OverviewMapControl';
import useSelectableTabs from '../../common/hooks/useSelectableTabs';
import useHighlightArea from '../map/hooks/useHighlightArea';

function useFeatures(
  vectorSource: VectorSource,
  collection: GeometryCollection | Feature[] | null
) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const featuresAdded = useRef(false);

  // Add features to vector source if they have not been added yet
  useEffect(() => {
    if (!featuresAdded.current && collection !== null) {
      let featuresToAdd = null;

      if (collection instanceof GeometryCollection) {
        featuresToAdd = collection.getGeometries().map((geom) => new Feature(geom));
      } else {
        featuresToAdd = collection;
      }

      featuresToAdd.map((feature) => {
        if (!feature.getId()) {
          feature.setId(uniqueId());
        }
        return feature;
      });

      if (featuresToAdd.length > 0) {
        vectorSource.addFeatures(featuresToAdd);
        setFeatures(featuresToAdd);
      }

      featuresAdded.current = true;
    }
  }, [features.length, vectorSource, collection]);

  // Update features array when features in vector source change
  useEffect(() => {
    const onDrawChange = debounce((event: VectorSourceEvent<Geometry>) => {
      const featuresInSource = vectorSource.getFeatures();

      const { feature } = event;
      if (!feature.getId()) {
        feature.setId(uniqueId());
      }

      setFeatures(featuresInSource);
    }, 100);

    vectorSource.on('addfeature', onDrawChange);
    vectorSource.on('changefeature', onDrawChange);
    vectorSource.on('removefeature', onDrawChange);

    return function cleanup() {
      onDrawChange.cancel();
      vectorSource.un('addfeature', onDrawChange);
      vectorSource.un('changefeature', onDrawChange);
      vectorSource.un('removefeature', onDrawChange);
    };
  }, [vectorSource]);

  return sortBy(features, (feature) => feature.getId());
}

export const initialValues = {
  geometriat: null,
};

export const Geometries: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { setValue, watch, getValues } = useFormContext();
  const [drawSource] = useState<VectorSource>(new VectorSource());

  const features = useFeatures(
    drawSource,
    new GeoJSON().readGeometry(getValues('applicationData.geometry')) as GeometryCollection
  );

  const { tabRefs } = useSelectableTabs(features.length, { selectLastTabOnChange: true });

  const higlightArea = useHighlightArea();

  const startTime: number | null = watch('applicationData.startTime');
  const endTime: number | null = watch('applicationData.endTime');
  const minEndDate = startTime ? new Date(startTime) : undefined;

  const workTimesSet = startTime && endTime;

  useEffect(() => {
    // Update geometry collection to form state
    const hankeGeometries = formatFeaturesToAlluGeoJSON(features);
    setValue('applicationData.geometry', hankeGeometries);
  }, [features, setValue]);

  return (
    <div>
      <Text tag="p" spacingBottom="s">
        {t('johtoselvitysForm:alueet:instructions')}
      </Text>
      <Text tag="p" spacingBottom="m">
        {t('form:requiredInstruction')}
      </Text>

      <Text tag="h2" styleAs="h4" weight="bold" spacingBottom="s">
        {t('form:headers:alueet')}
      </Text>

      <ResponsiveGrid>
        <DatePicker
          name="applicationData.startTime"
          label={t('hakemus:labels:startDate')}
          locale={locale}
          required
          helperText={t('form:helperTexts:dateInForm')}
        />
        <DatePicker
          name="applicationData.endTime"
          label={t('hakemus:labels:endDate')}
          locale={locale}
          required
          minDate={minEndDate}
          initialMonth={minEndDate}
          helperText={t('form:helperTexts:dateInForm')}
        />
      </ResponsiveGrid>

      <div className={styles.mapContainer}>
        <Map zoom={9} mapClassName={styles.mapContainer__inner}>
          <Kantakartta />

          <VectorLayer source={drawSource} zIndex={100} className="drawLayer" />

          <FitSource source={drawSource} />

          <OverviewMapControl />

          <Controls>{workTimesSet && <DrawModule source={drawSource} />}</Controls>
        </Map>
      </div>

      {!workTimesSet && (
        <Box px="var(--spacing-l)" py="var(--spacing-2-xl)" textAlign="center">
          <Text tag="p">{t('johtoselvitysForm:alueet:giveDates')}</Text>
        </Box>
      )}

      <Tabs>
        <TabList>
          {features.map((feature, index) => {
            const geometry = feature.getGeometry();
            const surfaceArea = geometry && `(${formatSurfaceArea(geometry)})`;
            return (
              <Tab key={feature.getId()} onClick={() => higlightArea(feature)}>
                <div ref={tabRefs[index]}>
                  {t('hakemus:labels:workArea')} {index > 0 && index + 1} {surfaceArea}
                </div>
              </Tab>
            );
          })}
        </TabList>
        {features.map((feature) => (
          <TabPanel key={feature.getId()}>
            <Fieldset
              heading={t('hakemus:labels:areaInfo')}
              border
              className={styles.areaInfoContainer}
            >
              <Button
                variant="supplementary"
                iconLeft={<IconTrash aria-hidden="true" />}
                onClick={() => drawSource.removeFeature(feature)}
              >
                {t('hankeForm:hankkeenAlueForm:removeAreaButton')}
              </Button>
            </Fieldset>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};
export default Geometries;
