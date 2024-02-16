import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { Feature } from 'ol';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Box } from '@chakra-ui/react';
import HankeDrawer from '../../map/components/HankeDrawer/HankeDrawer';
import { useFormPage } from './hooks/useFormPage';
import { FORMFIELD, FormProps, HankeAlueFormState, HankeDataFormState } from './types';
import { formatSurfaceArea } from '../../map/utils';
import Haitat from './components/Haitat';
import Text from '../../../common/components/text/Text';
import useSelectableTabs from '../../../common/hooks/useSelectableTabs';
import useHighlightArea from '../../map/hooks/useHighlightArea';
import useAddressCoordinate from '../../map/hooks/useAddressCoordinate';
import useFieldArrayWithStateUpdate from '../../../common/hooks/useFieldArrayWithStateUpdate';
import { HankeAlue } from '../../types/hanke';
import { getAreaDefaultName } from './utils';

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

const HankeFormAlueet: React.FC<FormProps> = ({ formData }) => {
  const { t } = useTranslation();
  const { setValue, trigger, watch, getValues } = useFormContext<HankeDataFormState>();
  const {
    fields: hankeAlueet,
    append,
    remove,
  } = useFieldArrayWithStateUpdate<HankeDataFormState, 'alueet'>({
    name: FORMFIELD.HANKEALUEET,
  });
  const [drawSource] = useState<VectorSource>(new VectorSource());
  const addressCoordinate = useAddressCoordinate(formData.tyomaaKatuosoite);
  useFormPage();

  const { tabRefs } = useSelectableTabs(hankeAlueet, {
    selectLastTabOnChange: true,
  });

  const higlightArea = useHighlightArea();

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

  const handleChangeFeature = useCallback(() => {
    // When changing feature, trigger validation on
    // geometriesChanged field in order to update
    // surface area calculation for the changed area
    trigger(FORMFIELD.GEOMETRIES_CHANGED);
    setValue(FORMFIELD.GEOMETRIES_CHANGED, true, { shouldDirty: true });
  }, [trigger, setValue]);

  function removeArea(index: number) {
    remove(index);
    const featureToRemove = formData.alueet && formData.alueet[index].feature;
    if (featureToRemove) {
      drawSource.removeFeature(featureToRemove);
    }
  }

  const features = useMemo(() => hankeAlueet.map((alue) => alue.feature), [hankeAlueet]);

  return (
    <div>
      <Box mb="var(--spacing-m)">
        <p>{t('hankeForm:hankkeenAlueForm:instructions')}</p>
      </Box>

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
        />
      </Box>

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
                <Tab key={alue.id} onClick={() => higlightArea(alue.feature)}>
                  <div ref={tabRefs[index]}>
                    {name} {surfaceArea}
                  </div>
                </Tab>
              );
            })}
          </TabList>
          {hankeAlueet.map((item, index) => (
            <TabPanel key={item.id}>
              <Haitat index={index} onRemoveArea={removeArea} />
            </TabPanel>
          ))}
        </Tabs>
      )}
    </div>
  );
};
export default HankeFormAlueet;
