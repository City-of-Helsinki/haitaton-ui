import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Fieldset, Notification, Tab, TabList, TabPanel, Tabs, Tooltip } from 'hds-react';
import { Box, Flex, Grid } from '@chakra-ui/react';
import { Feature } from 'ol';
import { Geometry, Polygon } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import booleanIntersects from '@turf/boolean-intersects';
import { polygon } from '@turf/helpers';
import { $enum } from 'ts-enum-util';
import Text from '../../common/components/text/Text';
import ResponsiveGrid from '../../common/components/grid/ResponsiveGrid';
import DatePicker from '../../common/components/datePicker/DatePicker';
import useLocale from '../../common/hooks/useLocale';
import { KaivuilmoitusFormValues } from './types';
import HankeLayer from '../map/components/Layers/HankeLayer';
import {
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
  HANKE_TYOMAATYYPPI,
  HankeAlue,
  HankeData,
} from '../types/hanke';
import styles from './Kaivuilmoitus.module.scss';
import ApplicationMap from '../application/components/ApplicationMap';
import { KaivuilmoitusAlue, Tyoalue } from '../application/types/application';
import useSelectableTabs from '../../common/hooks/useSelectableTabs';
import TextInput from '../../common/components/textInput/TextInput';
import Dropdown from '../../common/components/dropdown/Dropdown';
import DropdownMultiselect from '../../common/components/dropdown/DropdownMultiselect';
import TextArea from '../../common/components/textArea/TextArea';
import DrawProvider from '../../common/components/map/modules/draw/DrawProvider';
import { getTotalSurfaceArea } from '../map/utils';
import TyoalueTable from './components/TyoalueTable';
import AreaSelectDialog from './components/AreaSelectDialog';

function getEmptyArea(
  hankeData: HankeData,
  hankeAlue: HankeAlue,
  feature: Feature<Geometry>,
): KaivuilmoitusAlue {
  return {
    name: hankeAlue.nimi!,
    hankealueId: hankeAlue.id!,
    tyoalueet: [new Tyoalue(feature)],
    katuosoite: hankeData.tyomaaKatuosoite!,
    tyonTarkoitukset: hankeData.tyomaaTyyppi,
    meluhaitta: hankeAlue.meluHaitta,
    polyhaitta: hankeAlue.polyHaitta,
    tarinahaitta: hankeAlue.tarinaHaitta,
    kaistahaitta: hankeAlue.kaistaHaitta,
    kaistahaittojenPituus: hankeAlue.kaistaPituusHaitta,
  };
}

type Props = {
  hankeData: HankeData;
};

export default function Areas({ hankeData }: Readonly<Props>) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [multipleHankeAreaSpanningFeature, setMultipleHankeAreaSpanningFeature] =
    useState<Feature<Geometry> | null>(null);
  const { getValues, setValue, watch, trigger } = useFormContext<KaivuilmoitusFormValues>();
  const {
    fields: applicationAreas,
    append,
    remove,
  } = useFieldArray<KaivuilmoitusFormValues, 'applicationData.areas'>({
    name: 'applicationData.areas',
  });
  const wathcApplicationAreas = watch('applicationData.areas');
  const totalSurfaceArea = getTotalSurfaceArea(
    wathcApplicationAreas
      .flatMap((area) => area.tyoalueet)
      .map((alue) => alue.openlayersFeature!.getGeometry()!),
  );

  const [drawSource] = useState<VectorSource>(() => {
    const features = applicationAreas
      .flatMap((area) => area.tyoalueet)
      .flatMap((area) => (area.openlayersFeature ? area.openlayersFeature : []));
    return new VectorSource({ features });
  });

  const { tabRefs, setSelectedTabIndex } = useSelectableTabs(applicationAreas, {
    selectLastTabOnChange: true,
  });

  const startTime = watch('applicationData.startTime');
  const endTime = watch('applicationData.endTime');
  const minStartDate = hankeData.alkuPvm ? new Date(hankeData.alkuPvm) : undefined;
  const minEndDate = startTime ? new Date(startTime) : undefined;
  const maxDate = hankeData.loppuPvm ? new Date(hankeData.loppuPvm) : undefined;
  const workTimesSet = startTime && endTime;

  function addTyoAlueToHankeArea(hankeArea: HankeAlue, feature: Feature<Geometry>) {
    const existingArea = applicationAreas.find((alue) => alue.hankealueId === hankeArea.id);
    if (!existingArea) {
      append(getEmptyArea(hankeData, hankeArea, feature));
    } else {
      const existingAreaIndex = applicationAreas.indexOf(existingArea);
      setValue(
        `applicationData.areas.${existingAreaIndex}.tyoalueet`,
        getValues(`applicationData.areas.${existingAreaIndex}.tyoalueet`).concat(
          new Tyoalue(feature),
        ),
      );
      setSelectedTabIndex(existingAreaIndex);
    }
  }

  function handleAddArea(feature: Feature<Geometry>) {
    const newAreaPolygon = polygon((feature.getGeometry() as Polygon).getCoordinates());
    // Check if the new tyoalue intersects with any of the existing hanke areas
    const hankeAlueetContainingNewArea = hankeData.alueet.filter((alue) =>
      booleanIntersects(alue.geometriat?.featureCollection.features[0], newAreaPolygon),
    );

    if (hankeAlueetContainingNewArea.length === 0) {
      drawSource.removeFeature(feature);
    } else if (hankeAlueetContainingNewArea.length === 1) {
      addTyoAlueToHankeArea(hankeAlueetContainingNewArea[0], feature);
    } else {
      setMultipleHankeAreaSpanningFeature(feature);
    }
  }

  function handleAreaSelectDialogClose() {
    if (multipleHankeAreaSpanningFeature) {
      drawSource.removeFeature(multipleHankeAreaSpanningFeature);
    }
    setMultipleHankeAreaSpanningFeature(null);
  }

  function handleAreaSelectConfirm(hankeArea: HankeAlue) {
    addTyoAlueToHankeArea(hankeArea, multipleHankeAreaSpanningFeature!);
    setMultipleHankeAreaSpanningFeature(null);
  }

  // Trigger validation for startTime field
  function validateStartTime() {
    trigger('applicationData.startTime');
  }

  // Trigger validation for endTime field
  function validateEndTime() {
    trigger('applicationData.endTime');
  }

  return (
    <DrawProvider source={drawSource}>
      <div>
        <div className={styles.formInstructions}>
          <Trans i18nKey="kaivuilmoitusForm:alueet:instructions">
            <p>
              Aloita hakemuksen työalueiden piirtäminen lisäämällä työn alku- ja loppupäivämäärät,
              jolloin hankealueesi ilmestyvät näkyviin. HUOM! Työn ajankohdan tulee sijoittua
              hankealueen aikavälille.
            </p>
            <p>
              Voit muokata jo piirrettyä aluetta tarttumalla sen reunasta kiinni ja vetämällä
              pisteen haluamaasi kohtaan.
            </p>
            <p>
              Jos haluat piirtää hankealueiden sisälle pienempiä työalueita, aktivoi piirtotyökalut
              kartan päältä. Huomioi, että työalueet tulee piirtää kokonaan hankealueiden sisälle.
            </p>
            <p>
              Jos haluat käyttää koko hankealuetta työalueena, valitse hankealue kartalta
              aktiviiseksi ja hanketietolaatikosta "Käytä työalueena".
            </p>
            <p>
              Voit lisätä samalle hakemukselle useampia alueita mikäli niiden aikaväli on sama. Jos
              haluat ilmoittaa useamman alueen eri aikaväleillä, tulee sinun tehdä erillinen
              hakemus.
            </p>
            <p>
              Kaikki tähdellä * merkityt kentät ovat hakemuksen lähettämisen kannalta pakollisia.
            </p>
          </Trans>
        </div>

        <Flex gap="var(--spacing-2-xs)" marginBottom="var(--spacing-s)">
          <Text tag="h3" styleAs="h4" weight="bold">
            {t('form:headers:alueet')}
          </Text>
          <Tooltip>{t('map:tooltips:areaDates')}</Tooltip>
        </Flex>

        <Fieldset heading={t('form:labels:timespan')}>
          <ResponsiveGrid>
            <DatePicker
              name="applicationData.startTime"
              label={t('kaivuilmoitusForm:alueet:startDate')}
              locale={locale}
              required
              minDate={minStartDate}
              maxDate={maxDate}
              initialMonth={minStartDate}
              helperText={t('form:helperTexts:dateInForm')}
              onValueChange={validateStartTime}
            />
            <DatePicker
              name="applicationData.endTime"
              label={t('kaivuilmoitusForm:alueet:endDate')}
              locale={locale}
              required
              minDate={minEndDate}
              maxDate={maxDate}
              initialMonth={minEndDate}
              helperText={t('form:helperTexts:dateInForm')}
              onValueChange={validateEndTime}
            />
          </ResponsiveGrid>
        </Fieldset>

        <ApplicationMap
          drawSource={drawSource}
          showDrawControls={Boolean(workTimesSet)}
          onAddArea={handleAddArea}
        >
          <HankeLayer
            hankeData={hankeData && [hankeData]}
            startDate={startTime?.toString()}
            endDate={endTime?.toString()}
            fitSource
          />
        </ApplicationMap>

        {!workTimesSet && (
          <Box px="var(--spacing-l)" py="var(--spacing-2-xl)" textAlign="center">
            <Text tag="p">{t('johtoselvitysForm:alueet:giveDates')}</Text>
          </Box>
        )}

        {totalSurfaceArea > 0 && (
          <Box marginBottom="var(--spacing-m)">
            <Notification label={t('hakemus:labels:totalSurfaceArea')} size="small">
              {t('hakemus:labels:totalSurfaceAreaLong')} {totalSurfaceArea} m²
            </Notification>
          </Box>
        )}

        <Tabs>
          <TabList>
            {applicationAreas.map((alue, index) => {
              return (
                <Tab key={alue.id}>
                  <div ref={tabRefs[index]}>{alue.name}</div>
                </Tab>
              );
            })}
          </TabList>
          {applicationAreas.map((alue, index) => {
            return (
              <TabPanel key={alue.id}>
                <TyoalueTable
                  alueIndex={index}
                  drawSource={drawSource}
                  hankeAlueName={alue.name}
                  onRemoveLastArea={() => remove(index)}
                />

                <Fieldset heading={t('kaivuilmoitusForm:alueet:areaInformationHeading')} border>
                  <Box marginTop="var(--spacing-xs)" marginBottom="var(--spacing-m)">
                    <TextInput
                      name={`applicationData.areas.${index}.katuosoite`}
                      label={t('form:yhteystiedot:labels:osoite')}
                      required
                    />
                  </Box>

                  <Box marginBottom="var(--spacing-m)">
                    <DropdownMultiselect
                      name={`applicationData.areas.${index}.tyonTarkoitukset`}
                      id={`applicationData.areas.${index}.tyonTarkoitukset`}
                      options={$enum(HANKE_TYOMAATYYPPI).map((value) => ({
                        value,
                        label: t(`hanke:tyomaaTyyppi:${value}`),
                      }))}
                      label={t('hakemus:labels:tyonTarkoitus')}
                      mapValueToLabel={(value) => t(`hanke:tyomaaTyyppi:${value}`)}
                      errorMsg={t('hankeForm:insertFieldError')}
                    />
                  </Box>

                  <Box marginBottom="var(--spacing-m)">
                    <ResponsiveGrid>
                      <Dropdown
                        name={`applicationData.areas.${index}.meluhaitta`}
                        id={`applicationData.areas.${index}.meluhaitta`}
                        options={$enum(HANKE_MELUHAITTA).map((value) => ({
                          value,
                          label: t(`hanke:meluHaitta:${value}`),
                        }))}
                        label={t('hankeForm:labels:meluHaitta')}
                        required
                      />
                      <Dropdown
                        name={`applicationData.areas.${index}.polyhaitta`}
                        id={`applicationData.areas.${index}.polyhaitta`}
                        options={$enum(HANKE_POLYHAITTA).map((value) => ({
                          value,
                          label: t(`hanke:polyHaitta:${value}`),
                        }))}
                        label={t('hankeForm:labels:polyHaitta')}
                        required
                      />
                      <Dropdown
                        name={`applicationData.areas.${index}.tarinahaitta`}
                        id={`applicationData.areas.${index}.tarinahaitta`}
                        options={$enum(HANKE_TARINAHAITTA).map((value) => ({
                          value,
                          label: t(`hanke:tarinaHaitta:${value}`),
                        }))}
                        label={t('hankeForm:labels:tarinaHaitta')}
                        required
                      />
                    </ResponsiveGrid>
                  </Box>

                  <Grid
                    gridTemplateColumns={{ base: '1fr', md: '60% 1fr' }}
                    gap="var(--spacing-s)"
                    marginBottom="var(--spacing-m)"
                  >
                    <Dropdown
                      name={`applicationData.areas.${index}.kaistahaitta`}
                      id={`applicationData.areas.${index}.kaistahaitta`}
                      options={$enum(HANKE_KAISTAHAITTA).map((value) => ({
                        value,
                        label: t(`hanke:kaistaHaitta:${value}`),
                      }))}
                      label={t('hankeForm:labels:kaistaHaitta')}
                      required
                    />
                    <Dropdown
                      name={`applicationData.areas.${index}.kaistahaittojenPituus`}
                      id={`applicationData.areas.${index}.kaistahaittojenPituus`}
                      options={$enum(HANKE_KAISTAPITUUSHAITTA).map((value) => ({
                        value,
                        label: t(`hanke:kaistaPituusHaitta:${value}`),
                      }))}
                      label={t(`hankeForm:labels:kaistaPituusHaitta`)}
                      required
                    />
                  </Grid>

                  <TextArea
                    name={`applicationData.areas.${index}.lisatiedot`}
                    label={t('hakemus:labels:areaAdditionalInfo')}
                  />
                </Fieldset>
              </TabPanel>
            );
          })}
        </Tabs>

        <AreaSelectDialog
          isOpen={Boolean(multipleHankeAreaSpanningFeature)}
          hankeAreas={hankeData.alueet}
          onClose={handleAreaSelectDialogClose}
          onConfirm={handleAreaSelectConfirm}
        />
      </div>
    </DrawProvider>
  );
}
