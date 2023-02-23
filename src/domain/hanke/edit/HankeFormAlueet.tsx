import React, { useCallback, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { Feature } from 'ol';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Box } from '@chakra-ui/react';
import HankeDrawer from '../../map/components/HankeDrawer/HankeDrawer';
import { useFormPage } from './hooks/useFormPage';
import { FORMFIELD, FormProps, HankeAlueFormState } from './types';
import { formatSurfaceArea } from '../../map/utils';
import Haitat from './components/Haitat';
import Text from '../../../common/components/text/Text';
import useSelectableTabs from '../../../common/hooks/useSelectableTabs';
import useHighlightArea from '../../map/hooks/useHighlightArea';
import useAddressCoordinate from '../../map/hooks/useAddressCoordinate';

function getEmptyArea(feature: Feature): Omit<HankeAlueFormState, 'id' | 'geometriat'> {
  return {
    feature,
    haittaAlkuPvm: '',
    haittaLoppuPvm: '',
    meluHaitta: null,
    polyHaitta: null,
    tarinaHaitta: null,
    kaistaHaitta: null,
    kaistaPituusHaitta: null,
  };
}

const HankeFormAlueet: React.FC<FormProps> = ({ formData }) => {
  const { t } = useTranslation();
  const { setValue, trigger } = useFormContext();
  const { fields: hankeAlueet, append, remove } = useFieldArray({
    name: FORMFIELD.HANKEALUEET,
  });
  const [drawSource] = useState<VectorSource>(new VectorSource());
  const addressCoordinate = useAddressCoordinate(formData.tyomaaKatuosoite);
  useFormPage();

  const { tabRefs } = useSelectableTabs(hankeAlueet.length, { selectLastTabOnChange: true });

  const higlightArea = useHighlightArea();

  const handleAddFeature = useCallback(
    (feature: Feature<Geometry>) => {
      const geom = feature.getGeometry();
      if (geom) {
        append(getEmptyArea(feature));
      }

      setValue(FORMFIELD.GEOMETRIES_CHANGED, true, { shouldDirty: true });
    },
    [setValue, append]
  );

  const handleChangeFeature = useCallback(() => {
    // When changing feature, trigger validation on
    // geometriesChanged field in order to update
    // surface area calculation for the changed area
    trigger(FORMFIELD.GEOMETRIES_CHANGED);
  }, [trigger]);

  function removeArea(index: number) {
    remove(index);
    const featureToRemove = formData.alueet && formData.alueet[index].feature;
    if (featureToRemove) {
      drawSource.removeFeature(featureToRemove);
    }
  }

  const features = useMemo(() => formData.alueet?.map((alue) => alue.feature), [formData.alueet]);

  return (
    <div>
      <Box mb="var(--spacing-m)">
        <p>{t('hankeForm:hankkeenAlueForm:instructions')}</p>
      </Box>

      <Text tag="h3" styleAs="h4" weight="bold">
        <Box color="var(--color-bus)" mb="var(--spacing-m)">
          {t('hankeForm:hankkeenAlueForm:subHeader')}
        </Box>
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

      <Tabs>
        <TabList>
          {hankeAlueet.map((item, index) => {
            const hankeAlue = formData.alueet && formData.alueet[index];
            const hankeGeometry = hankeAlue?.feature?.getGeometry();
            const surfaceArea = hankeGeometry && `(${formatSurfaceArea(hankeGeometry)})`;
            return (
              <Tab key={item.id} onClick={() => higlightArea(hankeAlue?.feature)}>
                <div ref={tabRefs[index]}>
                  {t('hankeForm:hankkeenAlueForm:area')} {index + 1} {surfaceArea}
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
    </div>
  );
};
export default HankeFormAlueet;
