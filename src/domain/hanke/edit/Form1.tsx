import React, { useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import HankeDrawer from '../../map/components/HankeDrawer/HankeDrawerContainer';
import H2 from '../../../common/components/text/H2';
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
      <H2 data-testid="hankkeenAlue">{t('hankeForm:hankkeenAlueForm:header')}</H2>
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
