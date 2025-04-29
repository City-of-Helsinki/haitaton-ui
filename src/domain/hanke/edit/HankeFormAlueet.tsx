import React, { useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Notification, Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { Feature } from 'ol';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Box } from '@chakra-ui/react';
import { isEqual } from 'lodash';
import HankeDrawer from '../../map/components/HankeDrawer/HankeDrawer';
import { FORMFIELD, FormProps, HankeAlueFormState, HankeDataFormState } from './types';
import { formatFeaturesToHankeGeoJSON, formatSurfaceArea } from '../../map/utils';
import Haitat from './components/Haitat';
import Text from '../../../common/components/text/Text';
import useSelectableTabs from '../../../common/hooks/useSelectableTabs';
import useAddressCoordinate from '../../map/hooks/useAddressCoordinate';
import useFieldArrayWithStateUpdate from '../../../common/hooks/useFieldArrayWithStateUpdate';
import { HankeAlue } from '../../types/hanke';
import { getAreaDefaultName } from './utils';
import useHaittaIndexes from '../hooks/useHaittaIndexes';
import HaittaIndexes from '../../common/haittaIndexes/HaittaIndexes';
import useDrawContext from '../../../common/components/map/modules/draw/useDrawContext';
import { haveHaittaIndexesIncreased } from '../../common/haittaIndexes/utils';
import { useApplicationsForHanke } from '../../application/hooks/useApplications';

function getEmptyArea(feature: Feature): Omit<HankeAlueFormState, 'geometriat'> {
  return {
    feature,
    haittaAlkuPvm: null,
    haittaLoppuPvm: null,
    meluHaitta: null,
    polyHaitta: null,
    tarinaHaitta: null,
    kaistaHaitta: null,
    kaistaPituusHaitta: null,
    id: null,
  };
}

const HankeFormAlueet: React.FC<FormProps & { drawSource: VectorSource }> = ({
  hanke,
  drawSource,
}) => {
  const { t } = useTranslation();
  const {
    setValue,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext<HankeDataFormState>();
  const {
    fields: hankeAlueet,
    append,
    remove,
  } = useFieldArrayWithStateUpdate<HankeDataFormState, 'alueet'>({
    name: FORMFIELD.HANKEALUEET,
  });
  const watchHankeAlueet = watch('alueet');
  const addressCoordinate = useAddressCoordinate(hanke.tyomaaKatuosoite);
  const haittaIndexesMutation = useHaittaIndexes();
  const { data: hankkeenHakemukset } = useApplicationsForHanke(hanke.hankeTunnus, true);
  const hakemukset = hankkeenHakemukset?.applications || [];
  const { tabRefs, setSelectedTabIndex } = useSelectableTabs(hankeAlueet, {
    selectLastTabOnChange: true,
  });

  const {
    state: { selectedFeature },
    actions: { setSelectedFeature },
  } = useDrawContext();

  // When selected feature changes, update selected tab index
  useEffect(() => {
    const index = hankeAlueet.findIndex((alue) => isEqual(alue.feature, selectedFeature));
    if (index !== -1) {
      setSelectedTabIndex(index);
    }
  }, [selectedFeature, hankeAlueet, setSelectedTabIndex]);

  useEffect(() => {
    // If there are hanke areas with no name on unmount, set default names for them
    return function cleanup() {
      const areas = getValues(FORMFIELD.HANKEALUEET) as HankeAlue[];
      areas.forEach((area, i) => {
        if (!area.nimi) {
          setValue(`${FORMFIELD.HANKEALUEET}.${i}.nimi`, getAreaDefaultName(areas));
        }
      });
    };
  }, [getValues, setValue]);

  useEffect(() => {
    // Reset haittaIndexesIncreased on unmount
    return function cleanup() {
      setValue('haittaIndexesIncreased', false, { shouldValidate: true });
    };
  }, [setValue]);

  const calculateHaittaIndexes = useCallback(
    (hankeAlue: HankeAlueFormState) => {
      const hankeAlueIndex = watchHankeAlueet?.indexOf(hankeAlue);

      if (
        hankeAlue.feature &&
        hankeAlue.haittaAlkuPvm &&
        hankeAlue.haittaLoppuPvm &&
        hankeAlue.meluHaitta &&
        hankeAlue.polyHaitta &&
        hankeAlue.tarinaHaitta &&
        hankeAlue.kaistaHaitta &&
        hankeAlue.kaistaPituusHaitta
      ) {
        haittaIndexesMutation.mutate(
          {
            geometriat: {
              ...hankeAlue.geometriat,
              featureCollection: formatFeaturesToHankeGeoJSON([hankeAlue.feature]),
            },
            haittaAlkuPvm: hankeAlue.haittaAlkuPvm,
            haittaLoppuPvm: hankeAlue.haittaLoppuPvm,
            kaistaHaitta: hankeAlue.kaistaHaitta,
            kaistaPituusHaitta: hankeAlue.kaistaPituusHaitta,
          },
          {
            onSuccess(data) {
              if (
                hanke.status === 'PUBLIC' &&
                haveHaittaIndexesIncreased(data, hankeAlue.tormaystarkasteluTulos)
              ) {
                setValue('haittaIndexesIncreased', true, { shouldValidate: true });
              }
              hankeAlue.feature?.setProperties({
                liikennehaittaindeksi: data.liikennehaittaindeksi.indeksi,
              });
              if (hankeAlueIndex !== undefined) {
                setValue(`alueet.${hankeAlueIndex}.tormaystarkasteluTulos`, data);
              }
            },
          },
        );
      }
    },
    [setValue, haittaIndexesMutation, watchHankeAlueet, hanke.status],
  );

  const handleAddFeature = useCallback(
    (feature: Feature<Geometry>) => {
      const geom = feature.getGeometry();
      if (geom) {
        append(getEmptyArea(feature));
      }

      setValue(FORMFIELD.GEOMETRIES_CHANGED, true, { shouldDirty: true });
    },
    [setValue, append],
  );

  const handleChangeFeature = useCallback(
    (feature: Feature<Geometry>) => {
      const alue = watchHankeAlueet?.find((value) => isEqual(value.feature, feature));
      if (alue) {
        calculateHaittaIndexes(alue);
      }
      // When changing feature, trigger validation on
      // geometriesChanged field in order to update
      // surface area calculation for the changed area
      trigger(FORMFIELD.GEOMETRIES_CHANGED);
      setValue(FORMFIELD.GEOMETRIES_CHANGED, true, { shouldDirty: true });
    },
    [trigger, setValue, watchHankeAlueet, calculateHaittaIndexes],
  );

  function removeArea(index: number) {
    remove(index);
    const featureToRemove = hanke.alueet && hanke.alueet[index].feature;
    if (featureToRemove) {
      drawSource.removeFeature(featureToRemove);
    }
  }

  const features = useMemo(
    () =>
      hankeAlueet.map((hankeAlue) => {
        const { feature, tormaystarkasteluTulos, nimi } = hankeAlue;
        feature?.setProperties(
          {
            liikennehaittaindeksi: tormaystarkasteluTulos
              ? tormaystarkasteluTulos.liikennehaittaindeksi.indeksi
              : null,
            areaName: nimi,
          },
          true,
        );
        return feature;
      }),
    [hankeAlueet],
  );

  return (
    <div>
      <Box mb="var(--spacing-m)">
        <p>{t('hankeForm:hankkeenAlueForm:instructions')}</p>
      </Box>
      <Box mb="var(--spacing-m)">
        <p>{t('hankeForm:hankkeenAlueForm:instructions2')}</p>
      </Box>
      <Text tag="p" spacingBottom="m">
        {t('form:requiredForPublicationInstruction')}
      </Text>

      <Text tag="h3" styleAs="h4" weight="bold">
        <Box mb="var(--spacing-m)">{t('hankeForm:hankkeenAlueForm:subHeader')}</Box>
      </Text>

      <Box mb="var(--spacing-m)">
        <HankeDrawer
          onAddFeature={handleAddFeature}
          onChangeFeature={handleChangeFeature}
          features={features}
          center={addressCoordinate}
          drawSource={drawSource}
          hankkeenHakemukset={hakemukset}
          restrictDrawingToHakemusAreas={true}
        />
      </Box>

      {errors.haittaIndexesIncreased && (
        <Notification
          type="alert"
          label={t('hankeForm:hankkeenAlueForm:haittaIndexesChanged')}
          notificationAriaLabel={t('common:components:notification:notification')}
          autoClose={false}
          style={{ marginBottom: 'var(--spacing-s)' }}
        />
      )}

      {hankeAlueet.length < 1 ? (
        <Box textAlign="center" mt="var(--spacing-2-xl)" mb="var(--spacing-2-xl)">
          <p>{t('hankeForm:hankkeenAlueForm:noAlueet')}</p>
        </Box>
      ) : (
        <Tabs>
          <TabList>
            {hankeAlueet.map((alue, index) => {
              const hankeGeometry = alue.feature?.getGeometry();
              const surfaceArea = hankeGeometry && `(${formatSurfaceArea(hankeGeometry)})`;
              const name = watch(`${FORMFIELD.HANKEALUEET}.${index}.nimi`);
              return (
                <Tab key={alue.id} onClick={() => setSelectedFeature(alue.feature!)}>
                  <div ref={tabRefs[index]}>
                    {name} {surfaceArea}
                  </div>
                </Tab>
              );
            })}
          </TabList>
          {hankeAlueet.map((item, index) => (
            <TabPanel key={item.id}>
              <Box mb="var(--spacing-m)">
                <Haitat
                  index={index}
                  onRemoveArea={removeArea}
                  onChangeArea={(hankeAlue) => calculateHaittaIndexes(hankeAlue)}
                />
              </Box>
              <Box mb="var(--spacing-m)">
                <HaittaIndexes
                  heading={`${t('hanke:alue:liikennehaittaIndeksit')} (0-5)`}
                  haittaIndexData={
                    watchHankeAlueet && watchHankeAlueet[index].tormaystarkasteluTulos
                  }
                />
              </Box>
            </TabPanel>
          ))}
        </Tabs>
      )}
    </div>
  );
};
export default HankeFormAlueet;
