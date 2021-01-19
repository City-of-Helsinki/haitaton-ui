import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import HankeDrawer from '../../map/HankeDrawer';
import { FormProps } from '../../types/hanke';
import H2 from '../../../common/components/text/H2';

const Form1: React.FC<FormProps> = () => {
  const { t } = useTranslation();
  const { setValue, register } = useFormContext();

  useEffect(() => {
    register({ name: 'geometriesChanged', type: 'custom' });
  }, []);

  const handleChange = () => {
    setValue('geometriesChanged', true, { shouldDirty: true });
  };

  return (
    <div className="form1">
      <H2 data-testid="hankkeenAlue">{t('hankeForm:hankkeenAlueForm:header')}</H2>
      <div style={{ position: 'relative' }}>
        <HankeDrawer onChange={handleChange} />
      </div>
    </div>
  );
};
export default Form1;
