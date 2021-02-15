import React, { useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import HankeDrawer from '../../map/components/HankeDrawer/HankeDrawerContainer';
import Text from '../../../common/components/text/Text';
import { useFormPage } from './hooks/useFormPage';
import { FORMFIELD, FormProps } from './types';

const Form1: React.FC<FormProps> = ({ formData }) => {
  const { t } = useTranslation();
  const { setValue, register, unregister } = useFormContext();
  useFormPage();

  useEffect(() => {
    register({ name: FORMFIELD.GEOMETRIES_CHANGED, type: 'custom' });
    return () => {
      setValue(FORMFIELD.GEOMETRIES_CHANGED, false);
      unregister(FORMFIELD.GEOMETRIES_CHANGED);
    };
  }, [register]);

  const handleGeometriesChange = useCallback(() => {
    setValue(FORMFIELD.GEOMETRIES_CHANGED, true, { shouldDirty: true });
  }, []);

  return (
    <div className="form1">
      <Text tag="h2" spacing="s" weight="bold" data-testid="hankkeenAlue">
        {t('hankeForm:hankkeenAlueForm:header')}
      </Text>
      <div style={{ position: 'relative' }}>
        <HankeDrawer
          onChangeGeometries={handleGeometriesChange}
          hankeTunnus={formData.hankeTunnus}
        />
      </div>
    </div>
  );
};
export default Form1;
