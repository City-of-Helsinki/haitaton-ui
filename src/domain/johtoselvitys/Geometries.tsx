import React, { useEffect, useState } from 'react';
import { Feature } from 'ol';
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector';
import Polygon from 'ol/geom/Polygon';
import Geometry from 'ol/geom/Geometry';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import {
  Button,
  Fieldset,
  IconAlertCircleFill,
  IconTrash,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from 'hds-react';
import { debounce } from 'lodash';

import VectorLayer from '../../common/components/map/layers/VectorLayer';
import Map from '../../common/components/map/Map';
import FitSource from '../map/components/interations/FitSource';
import Kantakartta from '../map/components/Layers/Kantakartta';
import styles from './Geometries.module.scss';
import Controls from '../../common/components/map/controls/Controls';
import DrawModule from '../../common/components/map/modules/draw/DrawModule';
import { formatSurfaceArea } from '../map/utils';
import Text from '../../common/components/text/Text';
import ResponsiveGrid from '../../common/components/grid/ResponsiveGrid';
import DatePicker from '../../common/components/datePicker/DatePicker';
import useLocale from '../../common/hooks/useLocale';
import OverviewMapControl from '../../common/components/map/controls/OverviewMapControl';
import useSelectableTabs from '../../common/hooks/useSelectableTabs';
import useHighlightArea from '../map/hooks/useHighlightArea';
import { JohtoselvitysArea, JohtoselvitysFormValues } from './types';
import AddressSearchContainer from '../map/components/AddressSearch/AddressSearchContainer';
import useAddressCoordinate from '../map/hooks/useAddressCoordinate';
import TextInput from '../../common/components/textInput/TextInput';
import { ApplicationGeometry } from '../application/types/application';
import useForceUpdate from '../../common/hooks/useForceUpdate';
import { getAreaDefaultName } from '../application/utils';

function getEmptyArea(feature: Feature<Geometry>): JohtoselvitysArea {
  return {
    name: '',
    geometry: new ApplicationGeometry((feature.getGeometry() as Polygon).getCoordinates()),
    feature,
  };
}

export const Geometries: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const {
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<JohtoselvitysFormValues>();

  const { fields: applicationAreas, append, remove } = useFieldArray<
    JohtoselvitysFormValues,
    'applicationData.areas'
  >({
    name: 'applicationData.areas',
  });

  const [drawSource] = useState<VectorSource>(() => {
    const features = applicationAreas.flatMap((area) => (area.feature ? area.feature : []));
    return new VectorSource({ features });
  });

  const forceUpdate = useForceUpdate();

  const addressCoordinate = useAddressCoordinate(
    getValues('applicationData.postalAddress.streetAddress.streetName')
  );

  const [featuresLoaded, setFeaturesLoaded] = useState(false);

  useEffect(() => {
    function handleAddFeature(e: VectorSourceEvent<Geometry>) {
      append(getEmptyArea(e.feature));
    }

    const handleChangeFeature = debounce(() => {
      forceUpdate();
      if (featuresLoaded) {
        // When areas are modified set geometriesChanged with shouldDirty option
        // so that when changing form page application is saved
        setValue('geometriesChanged', true, { shouldDirty: true });
      }
    }, 100);

    drawSource.on('addfeature', handleAddFeature);
    drawSource.on('changefeature', handleChangeFeature);
    drawSource.once('featuresloadstart', () => {
      setFeaturesLoaded(true);
    });

    return function cleanup() {
      handleChangeFeature.cancel();
      drawSource.un('addfeature', handleAddFeature);
      drawSource.un('changefeature', handleChangeFeature);
    };
  }, [drawSource, append, forceUpdate, setValue, featuresLoaded]);

  const { tabRefs } = useSelectableTabs(applicationAreas.length, { selectLastTabOnChange: true });

  const higlightArea = useHighlightArea();

  const startTime: string | null = watch('applicationData.startTime');
  const endTime: string | null = watch('applicationData.endTime');
  const minEndDate = startTime ? new Date(startTime) : undefined;

  const workTimesSet = startTime && endTime;

  function removeArea(index: number, areaFeature?: Feature<Geometry>) {
    remove(index);
    if (areaFeature) {
      drawSource.removeFeature(areaFeature);
    }
  }

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
        <Map zoom={9} center={addressCoordinate} mapClassName={styles.mapContainer__inner}>
          <Kantakartta />

          <AddressSearchContainer position={{ top: '1rem', left: '1rem' }} zIndex={101} />

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

      {errors.applicationData?.areas && (
        <Box
          px="var(--spacing-l)"
          pb="var(--spacing-xl)"
          textAlign="center"
          color="var(--color-error)"
        >
          <Text tag="p">
            <IconAlertCircleFill /> {t('form:errors:areaRequired')}
          </Text>
        </Box>
      )}

      <Tabs>
        <TabList>
          {applicationAreas.map((area, index) => {
            const geometry = area.feature?.getGeometry();
            const surfaceArea = geometry && `(${formatSurfaceArea(geometry)})`;
            const name = watch(`applicationData.areas.${index}.name`);
            // Make sure that area name user entered is max 30 characters
            // If name is empty, use the default area name
            const areaName = name.slice(0, 30) || getAreaDefaultName(t, index);
            return (
              <Tab key={area.id} onClick={() => higlightArea(area.feature)}>
                <div ref={tabRefs[index]}>
                  {areaName}&nbsp;{surfaceArea}
                </div>
              </Tab>
            );
          })}
        </TabList>
        {applicationAreas.map((area, index) => (
          <TabPanel key={area.id}>
            <Fieldset
              heading={t('hakemus:labels:areaInfo')}
              border
              className={styles.areaInfoContainer}
            >
              <TextInput
                name={`applicationData.areas.${index}.name`}
                label={t('form:labels:areaName')}
                helperText={t('form:helperTexts:areaName')}
                className={styles.nameInput}
              />
              <Button
                variant="supplementary"
                iconLeft={<IconTrash aria-hidden="true" />}
                onClick={() => removeArea(index, area.feature)}
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
