import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { Feature } from 'ol';
import VectorSource from 'ol/source/Vector';
import { Coordinate } from 'ol/coordinate';
import Geometry from 'ol/geom/Geometry';
import { Box } from '@chakra-ui/react';
import HankeDrawer from '../../map/components/HankeDrawer/HankeDrawer';
import { useFormPage } from './hooks/useFormPage';
import { FORMFIELD, FormProps } from './types';
import { doAddressSearch, formatSurfaceArea } from '../../map/utils';
import Haitat from './components/Haitat';
import Text from '../../../common/components/text/Text';
import { STYLES } from '../../map/utils/geometryStyle';
import useSelectableTabs from '../../../common/hooks/useSelectableTabs';

const HankeFormAlueet: React.FC<FormProps> = ({ formData }) => {
  const { t } = useTranslation();
  const { setValue, trigger } = useFormContext();
  const { fields: hankeAlueet, append, remove } = useFieldArray({
    name: FORMFIELD.HANKEALUEET,
  });
  const [drawSource] = useState<VectorSource>(new VectorSource());
  const [addressCoordinate, setAddressCoordinate] = useState<Coordinate | undefined>();
  const [highlightedFeature, setHighlightedFeature] = useState<Feature | undefined>();
  useFormPage();

  const { tabRefs, setSelectendTabIndex } = useSelectableTabs(hankeAlueet.length);

  useEffect(() => {
    if (formData.tyomaaKatuosoite) {
      doAddressSearch(formData.tyomaaKatuosoite).then(({ data }) => {
        setAddressCoordinate(data.features[0]?.geometry.coordinates);
      });
    }
  }, [formData.tyomaaKatuosoite]);

  useEffect(() => {
    return () => {
      // Reset previously selected feature style
      // when higlighted feature changes
      highlightedFeature?.setStyle();
    };
  }, [highlightedFeature]);

  useEffect(() => {
    setSelectendTabIndex(hankeAlueet.length - 1);
  }, [hankeAlueet.length, setSelectendTabIndex]);

  // Set highlight style for areas feature
  const higlightArea = useCallback((feature: Feature | undefined) => {
    setHighlightedFeature(feature);

    feature?.setStyle(STYLES.BLUE_HL);
  }, []);

  const handleAddFeature = useCallback(
    (feature: Feature<Geometry>) => {
      const geom = feature.getGeometry();
      if (geom) {
        append({ feature });
      }

      higlightArea(feature);

      setValue(FORMFIELD.GEOMETRIES_CHANGED, true, { shouldDirty: true });
    },
    [setValue, append, higlightArea]
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
