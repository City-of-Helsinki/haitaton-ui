import { useState } from 'react';
import { Feature } from 'ol';
import VectorSource from 'ol/source/Vector';
import Polygon from 'ol/geom/Polygon';
import Geometry from 'ol/geom/Geometry';
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { Button, ButtonVariant, Fieldset, IconAlertCircleFill, IconCross } from 'hds-react';

import { formatSurfaceArea } from '../map/utils';
import Text from '../../common/components/text/Text';
import ResponsiveGrid from '../../common/components/grid/ResponsiveGrid';
import DatePicker from '../../common/components/datePicker/DatePicker';
import useLocale from '../../common/hooks/useLocale';
import useSelectableTabs from '../../common/hooks/useSelectableTabs';
import { JohtoselvitysArea, JohtoselvitysFormValues } from './types';
import { ApplicationGeometry } from '../application/types/application';
import { getAreaDefaultName } from '../application/utils';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { HankeData } from '../types/hanke';
import HankeLayer from '../map/components/Layers/HankeLayer';
import DrawProvider from '../../common/components/map/modules/draw/DrawProvider';
import useDrawContext from '../../common/components/map/modules/draw/useDrawContext';
import ApplicationMap from '../application/components/ApplicationMap';
import useAddressCoordinate from '../map/hooks/useAddressCoordinate';
import useFilterHankeAlueetByApplicationDates from '../application/hooks/useFilterHankeAlueetByApplicationDates';
import { OverlayProps } from '../../common/components/map/types';

function AreaList({
  applicationAreas,
  hankeName,
  onRemoveArea,
}: Readonly<{
  applicationAreas: FieldArrayWithId<JohtoselvitysFormValues, 'applicationData.areas', 'id'>[];
  hankeName?: string;
  onRemoveArea: (index: number, feature?: Feature<Geometry>) => void;
}>) {
  const { t } = useTranslation();
  const {
    actions: { setSelectedFeature },
  } = useDrawContext();
  const { tabRefs } = useSelectableTabs(applicationAreas, { selectLastTabOnChange: true });
  const { getValues } = useFormContext<JohtoselvitysFormValues>();

  return (
    <Box as="ul" paddingLeft="var(--spacing-l)">
      {applicationAreas.map((area, index) => {
        const geometry = area.feature?.getGeometry();
        const surfaceArea = geometry && `(${formatSurfaceArea(geometry)})`;
        const areaName = getAreaDefaultName(t, index, applicationAreas.length);

        area.feature?.setProperties(
          {
            areaName,
            hankeName,
            overlayProps: new OverlayProps({
              heading: areaName,
              startDate: getValues('applicationData.startTime'),
              endDate: getValues('applicationData.endTime'),
              backgroundColor: 'var(--color-suomenlinna-light)',
            }),
          },
          true,
        );

        return (
          <li key={area.id}>
            <Flex alignItems="center" direction={{ base: 'column', sm: 'row' }}>
              <Box
                as="button"
                type="button"
                _hover={{ textDecoration: 'underline' }}
                onClick={() => setSelectedFeature(area.feature!)}
              >
                <div ref={tabRefs[index]}>
                  {areaName} {surfaceArea}
                </div>
              </Box>
              <Button
                variant={ButtonVariant.Supplementary}
                style={{ color: 'var(--color-error)' }}
                iconStart={<IconCross />}
                onClick={() => onRemoveArea(index, area.feature)}
              >
                {t('hankeForm:hankkeenAlueForm:removeAreaButton')}
              </Button>
            </Flex>
          </li>
        );
      })}
    </Box>
  );
}

interface AreaToRemove {
  index: number;
  areaFeature: Feature<Geometry>;
}

function ErrorText({ children }: { children: string }) {
  return (
    <Box px="var(--spacing-l)" pb="var(--spacing-xl)" textAlign="center" color="var(--color-error)">
      <Text tag="p">
        <IconAlertCircleFill /> {children}
      </Text>
    </Box>
  );
}

function getEmptyArea(feature: Feature<Geometry>): JohtoselvitysArea {
  return {
    geometry: new ApplicationGeometry((feature.getGeometry() as Polygon).getCoordinates()),
    feature,
  };
}

type Props = {
  hankeData?: HankeData;
};

export function Geometries({ hankeData }: Readonly<Props>) {
  const { t } = useTranslation();
  const locale = useLocale();
  const {
    watch,
    getValues,
    formState: { errors },
  } = useFormContext<JohtoselvitysFormValues>();

  const {
    fields: applicationAreas,
    append,
    remove,
  } = useFieldArray<JohtoselvitysFormValues, 'applicationData.areas'>({
    name: 'applicationData.areas',
  });

  const [drawSource] = useState<VectorSource>(() => {
    const features = applicationAreas.flatMap((area) => (area.feature ? area.feature : []));
    return new VectorSource({ features });
  });

  const startTime = watch('applicationData.startTime');
  const endTime = watch('applicationData.endTime');
  const minEndDate = startTime ? new Date(startTime) : undefined;

  const workTimesSet = startTime && endTime;

  const [areaToRemove, setAreaToRemove] = useState<AreaToRemove | null>(null);

  const addressCoordinate = useAddressCoordinate(
    getValues('applicationData.postalAddress.streetAddress.streetName'),
  );

  const filterHankeAlueet = useFilterHankeAlueetByApplicationDates({
    applicationStartDate: startTime,
    applicationEndDate: endTime,
  });

  function handleAddArea(feature: Feature<Geometry>) {
    append(getEmptyArea(feature));
  }

  function handleCopyArea(feature: Feature<Geometry>) {
    drawSource.addFeature(feature);
  }

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
      <Text tag="p" spacingBottom="m">
        {t('johtoselvitysForm:alueet:instructions1')}
      </Text>
      <Text tag="p" spacingBottom="s">
        {t('johtoselvitysForm:alueet:instructions2')}
      </Text>
      <Text tag="p" spacingBottom="s">
        {t('johtoselvitysForm:alueet:instructions3')}
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

      <DrawProvider source={drawSource}>
        <ApplicationMap
          drawSource={drawSource}
          showDrawControls={Boolean(workTimesSet)}
          onAddArea={handleAddArea}
          onCopyArea={handleCopyArea}
          mapCenter={addressCoordinate}
          restrictDrawingToHankeAreas={!hankeData?.generated}
          workTimesSet={Boolean(workTimesSet)}
        >
          {/* Don't show hanke areas when hanke is generated */}
          {!hankeData?.generated && (
            <HankeLayer
              hankeData={hankeData && [hankeData]}
              fitSource
              filterHankeAlueet={filterHankeAlueet}
            />
          )}
        </ApplicationMap>

        {!workTimesSet && (
          <Box px="var(--spacing-l)" py="var(--spacing-2-xl)" textAlign="center">
            <Text tag="p">{t('johtoselvitysForm:alueet:giveDates')}</Text>
          </Box>
        )}

        {errors.applicationData?.areas && <ErrorText>{t('form:errors:areaRequired')}</ErrorText>}

        <Text tag="h3" styleAs="h4" weight="bold">
          {t('hakemus:labels:addedAreas')}
        </Text>
        <AreaList
          applicationAreas={applicationAreas}
          hankeName={hankeData?.nimi}
          onRemoveArea={removeArea}
        />
      </DrawProvider>

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
}
export default Geometries;
