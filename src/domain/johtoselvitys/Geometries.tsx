import React, { useEffect, useState } from 'react';
import { Feature } from 'ol';
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector';
import Polygon from 'ol/geom/Polygon';
import Geometry from 'ol/geom/Geometry';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { Button, Fieldset, IconAlertCircleFill, IconCross } from 'hds-react';
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
import { ApplicationGeometry } from '../application/types/application';
import useForceUpdate from '../../common/hooks/useForceUpdate';
import { getAreaDefaultName } from '../application/utils';
import FeatureHoverBox from '../map/components/FeatureHoverBox/FeatureHoverBox';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';

interface AreaToRemove {
  index: number;
  areaFeature: Feature<Geometry>;
}

function getEmptyArea(feature: Feature<Geometry>): JohtoselvitysArea {
  return {
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

  const [areaToRemove, setAreaToRemove] = useState<AreaToRemove | null>(null);

  function removeArea(index: number, areaFeature?: Feature<Geometry>) {
    if (areaFeature !== undefined) {
      setAreaToRemove({ index, areaFeature });
    }
  }

  function confirmRemoveArea() {
    if (areaToRemove !== null) {
      const { index, areaFeature } = areaToRemove;
      remove(index);
      drawSource.removeFeature(areaFeature);
      setAreaToRemove(null);
    }
  }

  function closeAreaRemoveDialog() {
    setAreaToRemove(null);
  }

  return (
    <div>
      <Text tag="p" spacingBottom="s">
        {t('johtoselvitysForm:alueet:instructions')}
      </Text>
      <Text tag="p" spacingBottom="m">
        {t('form:requiredInstruction')}
      </Text>

      <Text tag="h3" styleAs="h4" weight="bold" spacingBottom="s">
        {t('form:headers:alueet')}
      </Text>

      <Fieldset heading={t('form:labels:timespan')}>
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
      </Fieldset>

      <div className={styles.mapContainer}>
        <Map zoom={9} center={addressCoordinate} mapClassName={styles.mapContainer__inner}>
          <Kantakartta />

          <AddressSearchContainer position={{ top: '1rem', left: '1rem' }} zIndex={101} />

          <VectorLayer source={drawSource} zIndex={100} className="drawLayer" />

          <FitSource source={drawSource} />

          <OverviewMapControl />

          <FeatureHoverBox
            render={(featureWithPixel) => {
              const areaName = featureWithPixel.feature.get('areaName');
              return areaName ? <p>{areaName}</p> : null;
            }}
          />

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

      <Text tag="h3" styleAs="h4" weight="bold">
        {t('hakemus:labels:addedAreas')}
      </Text>
      <Box as="ul" paddingLeft="var(--spacing-l)">
        {applicationAreas.map((area, index) => {
          const geometry = area.feature?.getGeometry();
          const surfaceArea = geometry && `(${formatSurfaceArea(geometry)})`;
          const areaName = getAreaDefaultName(t, index, applicationAreas.length);

          area.feature?.set('areaName', areaName);

          return (
            <li key={area.id}>
              <Flex alignItems="center">
                <Box
                  as="button"
                  type="button"
                  textDecoration="underline"
                  onClick={() => higlightArea(area.feature)}
                >
                  <div ref={tabRefs[index]}>
                    {areaName} {surfaceArea}
                  </div>
                </Box>
                <Button
                  variant="supplementary"
                  style={{ color: 'var(--color-error)' }}
                  iconLeft={<IconCross aria-hidden="true" />}
                  onClick={() => removeArea(index, area.feature)}
                >
                  {t('hankeForm:hankkeenAlueForm:removeAreaButton')}
                </Button>
              </Flex>
            </li>
          );
        })}
      </Box>

      <ConfirmationDialog
        title={t('hakemus:labels:removeAreaTitle')}
        description={t('hakemus:labels:removeAreaDescription', {
          areaName: getAreaDefaultName(t, areaToRemove?.index, applicationAreas.length),
        })}
        isOpen={areaToRemove !== null}
        close={closeAreaRemoveDialog}
        mainAction={confirmRemoveArea}
        mainBtnLabel={t('common:confirmationDialog:confirmButton')}
        variant="danger"
      />
    </div>
  );
};
export default Geometries;
