import { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Fieldset, Notification, Tab, TabList, TabPanel, Tabs, Tooltip } from 'hds-react';
import { Box, Flex, Grid } from '@chakra-ui/react';
import { Feature } from 'ol';
import { Geometry, Polygon } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
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
import { HankkeenHakemus, KaivuilmoitusAlue, Tyoalue } from '../application/types/application';
import useSelectableTabs from '../../common/hooks/useSelectableTabs';
import TextInput from '../../common/components/textInput/TextInput';
import Dropdown from '../../common/components/dropdown/Dropdown';
import DropdownMultiselect from '../../common/components/dropdown/DropdownMultiselect';
import TextArea from '../../common/components/textArea/TextArea';
import DrawProvider from '../../common/components/map/modules/draw/DrawProvider';
import { formatFeaturesToHankeGeoJSON, getTotalSurfaceArea } from '../map/utils';
import TyoalueTable from './components/TyoalueTable';
import AreaSelectDialog from './components/AreaSelectDialog';
import booleanContains from '@turf/boolean-contains';
import { getAreaDefaultName } from '../application/utils';
import HaittaIndexes from '../common/haittaIndexes/HaittaIndexes';
import useHaittaIndexes from '../hanke/hooks/useHaittaIndexes';
import { calculateLiikennehaittaindeksienYhteenveto } from './utils';
import useFilterHankeAlueetByApplicationDates from '../application/hooks/useFilterHankeAlueetByApplicationDates';
import { styleFunction } from '../map/utils/geometryStyle';
import HakemusLayer from '../map/components/Layers/HakemusLayer';
import { OverlayProps } from '../../common/components/map/types';
import { LIIKENNEHAITTA_STATUS } from '../common/utils/liikennehaittaindeksi';

function getEmptyArea(
  hankeData: HankeData,
  hankeAlue: HankeAlue,
  feature: Feature<Geometry>,
): [KaivuilmoitusAlue, Tyoalue] {
  const tyoalue = new Tyoalue(feature);
  return [
    {
      name: hankeAlue.nimi!,
      hankealueId: hankeAlue.id!,
      tyoalueet: [tyoalue],
      katuosoite: hankeData.tyomaaKatuosoite!,
      tyonTarkoitukset: hankeData.tyomaaTyyppi,
      meluhaitta: hankeAlue.meluHaitta,
      polyhaitta: hankeAlue.polyHaitta,
      tarinahaitta: hankeAlue.tarinaHaitta,
      kaistahaitta: hankeAlue.kaistaHaitta,
      kaistahaittojenPituus: hankeAlue.kaistaPituusHaitta,
      haittojenhallintasuunnitelma: {},
    },
    tyoalue,
  ];
}

type Props = {
  hankeData: HankeData;
  hankkeenHakemukset: HankkeenHakemus[];
};

export default function Areas({ hankeData, hankkeenHakemukset }: Readonly<Props>) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [multipleHankeAreaSpanningFeature, setMultipleHankeAreaSpanningFeature] =
    useState<Feature<Geometry> | null>(null);
  const [hankeAreasContainingNewArea, setHankeAreasContainingNewArea] = useState<HankeAlue[]>([]);

  const { getValues, setValue, watch, trigger } = useFormContext<KaivuilmoitusFormValues>();
  const {
    fields: applicationAreas,
    append,
    remove,
  } = useFieldArray<KaivuilmoitusFormValues, 'applicationData.areas'>({
    name: 'applicationData.areas',
  });
  const wathcApplicationAreas = watch('applicationData.areas');
  const haittaIndexesMutation = useHaittaIndexes();

  const totalSurfaceArea = getTotalSurfaceArea(
    wathcApplicationAreas
      .flatMap((area) => area.tyoalueet)
      .map((alue) => alue.openlayersFeature!.getGeometry()!),
  );

  const [drawSource] = useState<VectorSource>(() => {
    const features = applicationAreas.flatMap((area) =>
      area.tyoalueet.flatMap((tyoalue, index) => {
        if (tyoalue.openlayersFeature) {
          const areaName = getAreaDefaultName(t, index, area.tyoalueet.length);
          tyoalue.openlayersFeature?.setProperties(
            {
              areaName,
              hankeName: hankeData.nimi,
              relatedHankeAreaName: area.name,
              relatedHankeAreaId: area.hankealueId,
              liikennehaittaindeksi: tyoalue.tormaystarkasteluTulos
                ? tyoalue.tormaystarkasteluTulos.liikennehaittaindeksi.indeksi
                : null,
              overlayProps: new OverlayProps({
                heading: areaName,
                startDate: getValues('applicationData.startTime'),
                endDate: getValues('applicationData.endTime'),
                backgroundColor: 'var(--color-suomenlinna-light)',
              }),
            },
            true,
          );
          return tyoalue.openlayersFeature;
        }
        return [];
      }),
    );
    return new VectorSource({ features });
  });

  const selectedJohtoselvitysTunnukset = getValues('applicationData.cableReports');
  const selectedJohtoselvitykset = hankkeenHakemukset.filter((hakemus) =>
    selectedJohtoselvitysTunnukset?.includes(hakemus.applicationIdentifier!),
  );

  const { tabRefs, setSelectedTabIndex } = useSelectableTabs(applicationAreas, {
    selectLastTabOnChange: true,
  });

  const startTime = watch('applicationData.startTime');
  const endTime = watch('applicationData.endTime');
  const minStartDate = hankeData.alkuPvm ? new Date(hankeData.alkuPvm) : undefined;
  const minEndDate = startTime ? new Date(startTime) : undefined;
  const maxDate = hankeData.loppuPvm ? new Date(hankeData.loppuPvm) : undefined;
  const workTimesSet = startTime && endTime;

  const filterHankeAlueet = useFilterHankeAlueetByApplicationDates({
    applicationStartDate: startTime,
    applicationEndDate: endTime,
  });

  const refreshHaittaIndexes = useCallback(
    (kaivuilmoitusalueIndex?: number) => {
      const applicationData = getValues('applicationData');
      const kaivuilmoitusalueet = applicationData.areas;
      if (kaivuilmoitusalueIndex === undefined) {
        // calculate for all areas
        kaivuilmoitusalueet.forEach((_, index) => {
          refreshHaittaIndexes(index);
        });
      } else {
        const kaivuilmoitusalue = kaivuilmoitusalueet[kaivuilmoitusalueIndex];
        const calculateHaittaIndexesForTyoalue = (
          ka: KaivuilmoitusAlue,
          ta: Tyoalue,
          tyoalueIndex: number,
        ) => {
          const request = {
            geometriat: {
              featureCollection: formatFeaturesToHankeGeoJSON([ta.openlayersFeature!]),
            },
            haittaAlkuPvm: applicationData.startTime ?? new Date(),
            haittaLoppuPvm: applicationData.endTime ?? new Date(),
            kaistaHaitta: ka.kaistahaitta ?? 'EI_VAIKUTA',
            kaistaPituusHaitta: ka.kaistahaittojenPituus ?? 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
          };
          haittaIndexesMutation.mutate(request, {
            onSuccess(data) {
              if (kaivuilmoitusalueIndex !== -1 && tyoalueIndex !== -1) {
                const tyoalue = getValues(
                  `applicationData.areas.${kaivuilmoitusalueIndex}.tyoalueet.${tyoalueIndex}`,
                );
                tyoalue.openlayersFeature?.setProperties({
                  liikennehaittaindeksi: data.liikennehaittaindeksi.indeksi,
                });
                setValue(
                  `applicationData.areas.${kaivuilmoitusalueIndex}.tyoalueet.${tyoalueIndex}.tormaystarkasteluTulos`,
                  data,
                );
              }
            },
          });
        };

        // calculate for all work areas
        kaivuilmoitusalue.tyoalueet.forEach((ta, index) => {
          calculateHaittaIndexesForTyoalue(kaivuilmoitusalue, ta, index);
        });
      }
    },
    [getValues, setValue, haittaIndexesMutation],
  );

  function addTyoAlueToHankeArea(hankeArea: HankeAlue, feature: Feature<Geometry>) {
    const areas = getValues('applicationData.areas');
    const existingArea = areas.find((alue) => alue.hankealueId === hankeArea.id);
    const request = {
      geometriat: {
        featureCollection: formatFeaturesToHankeGeoJSON([feature]),
      },
      haittaAlkuPvm: startTime ?? new Date(),
      haittaLoppuPvm: endTime ?? new Date(),
      kaistaHaitta: hankeArea.kaistaHaitta ?? 'EI_VAIKUTA',
      kaistaPituusHaitta: hankeArea.kaistaPituusHaitta ?? 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
    };
    haittaIndexesMutation.mutate(request, {
      onSuccess(data) {
        feature.setProperties({
          hankeName: hankeData.nimi,
          relatedHankeAreaName: hankeArea.nimi,
          relatedHankeAreaId: hankeArea.id,
          tormaystarkasteluTulos: data,
          liikennehaittaindeksi: data.liikennehaittaindeksi.indeksi,
          overlayProps: new OverlayProps({
            startDate: getValues('applicationData.startTime'),
            endDate: getValues('applicationData.endTime'),
            backgroundColor: 'var(--color-suomenlinna-light)',
          }),
        });
        if (!existingArea) {
          const [emptyArea] = getEmptyArea(hankeData, hankeArea, feature);
          append(emptyArea);
        } else {
          const existingAreaIndex = areas.indexOf(existingArea);
          const newTyoalue = new Tyoalue(feature);
          setValue(
            `applicationData.areas.${existingAreaIndex}.tyoalueet`,
            areas[existingAreaIndex].tyoalueet.concat(newTyoalue),
          );
          setSelectedTabIndex(existingAreaIndex);
        }
      },
    });
  }

  function handleAddArea(feature: Feature<Geometry>) {
    const newAreaPolygon = polygon((feature.getGeometry() as Polygon).getCoordinates());
    // Check if the new tyoalue is contained in any of the existing hanke areas
    const hankeAlueetContainingNewArea = hankeData.alueet.filter((alue) => {
      const hankeAlueFeature = alue.geometriat?.featureCollection.features[0];
      return hankeAlueFeature && booleanContains(hankeAlueFeature, newAreaPolygon);
    });
    setHankeAreasContainingNewArea(hankeAlueetContainingNewArea);

    if (hankeAlueetContainingNewArea.length === 0) {
      // If the new tyoalue does not intersect with any hanke area, remove it
      drawSource.removeFeature(feature);
    } else if (hankeAlueetContainingNewArea.length === 1) {
      // If the new tyoalue is contained in exactly one hanke area, add it to that
      addTyoAlueToHankeArea(hankeAlueetContainingNewArea[0], feature);
    } else {
      // New työalue is contained in multiple hanke areas, open dialog for user to select one
      setMultipleHankeAreaSpanningFeature(feature);
    }
  }

  function handleCopyArea(feature: Feature<Geometry>) {
    drawSource.addFeature(feature);
    handleAddArea(feature);
  }

  function handleChangeArea(feature: Feature<Geometry>) {
    const changedApplicationArea = wathcApplicationAreas.find((alue) => {
      const changedTyoalue = alue.tyoalueet.find(
        (tyoalue) =>
          tyoalue.openlayersFeature?.get('relatedHankeAreaId') ===
          feature.get('relatedHankeAreaId'),
      );
      return !!changedTyoalue;
    });
    if (changedApplicationArea) {
      const changedTyoalue = changedApplicationArea.tyoalueet.find((tyoalue) => {
        return tyoalue.openlayersFeature?.get('areaName') === feature.get('areaName');
      });
      if (changedTyoalue) {
        const request = {
          geometriat: {
            featureCollection: formatFeaturesToHankeGeoJSON([feature]),
          },
          haittaAlkuPvm: startTime ?? new Date(),
          haittaLoppuPvm: endTime ?? new Date(),
          kaistaHaitta: changedApplicationArea.kaistahaitta ?? 'EI_VAIKUTA',
          kaistaPituusHaitta:
            changedApplicationArea.kaistahaittojenPituus ?? 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
        };
        haittaIndexesMutation.mutate(request, {
          onSuccess(data) {
            changedTyoalue.tormaystarkasteluTulos = data;
            feature.set('liikennehaittaindeksi', data.liikennehaittaindeksi.indeksi);
          },
        });
      }
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

  function handleStartTimeChange() {
    // Trigger validation for startTime field
    trigger('applicationData.startTime').then(() => {
      refreshHaittaIndexes();
    });
  }

  function handleEndTimeChange() {
    // Trigger validation for endTime field
    trigger('applicationData.endTime').then(() => {
      refreshHaittaIndexes();
    });
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
              Kartan vasemmassa reunassa olevilla kulkumuotovalitsimilla voit tarkastella hanke- ja
              työalueiden haittaindeksejä tietylle kulkumuodolle. Kaikki kulkumuodot ovat oletuksena
              aktiivisina, voit vaihtaa näkyvien kulkumuotojen määrää klikkaamalla ikoneja. Kartalla
              näkyy valittujen kulkumuotojen kriittisin indeksiväri.
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
              onValueChange={handleStartTimeChange}
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
              onValueChange={handleEndTimeChange}
            />
          </ResponsiveGrid>
        </Fieldset>

        <ApplicationMap
          drawSource={drawSource}
          showDrawControls={Boolean(workTimesSet)}
          onAddArea={handleAddArea}
          onChangeArea={handleChangeArea}
          onCopyArea={handleCopyArea}
          restrictDrawingToHankeAreas
          workTimesSet={Boolean(workTimesSet)}
        >
          {/* Hanke areas */}
          <HankeLayer
            hankeData={hankeData && [hankeData]}
            fitSource
            filterHankeAlueet={filterHankeAlueet}
          />
          {/* Johtoselvitys areas */}
          {selectedJohtoselvitykset.map((hakemus) => (
            <HakemusLayer
              key={hakemus.id}
              hakemusId={hakemus.id!}
              layerStyle={styleFunction}
              featureProperties={{ statusKey: LIIKENNEHAITTA_STATUS.LAVENDER_BLUE }}
            />
          ))}
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
                  johtoselvitykset={selectedJohtoselvitykset}
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
                      required
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
                      onValueChange={() => refreshHaittaIndexes(index)}
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
                      onValueChange={() => refreshHaittaIndexes(index)}
                      required
                    />
                  </Grid>

                  <TextArea
                    name={`applicationData.areas.${index}.lisatiedot`}
                    label={t('hakemus:labels:areaAdditionalInfo')}
                  />
                </Fieldset>

                <Box mb="var(--spacing-m)" mt="var(--spacing-m)">
                  <HaittaIndexes
                    heading={`${t('kaivuilmoitusForm:alueet:liikennehaittaindeksienYhteenveto')} (0-5)`}
                    haittaIndexData={
                      wathcApplicationAreas &&
                      calculateLiikennehaittaindeksienYhteenveto(wathcApplicationAreas[index])
                    }
                    autoHaitanKestoHeading={t(
                      'kaivuilmoitusForm:haittojenHallinta:carTrafficNuisanceType:haitanKesto',
                    )}
                    autoHaitanKestoTooltipTranslationKey="hankeIndexes:tooltips:autoTyonKesto"
                  />
                </Box>
              </TabPanel>
            );
          })}
        </Tabs>

        <AreaSelectDialog
          isOpen={Boolean(multipleHankeAreaSpanningFeature)}
          hankeAreas={hankeAreasContainingNewArea}
          onClose={handleAreaSelectDialogClose}
          onConfirm={handleAreaSelectConfirm}
        />
      </div>
    </DrawProvider>
  );
}
