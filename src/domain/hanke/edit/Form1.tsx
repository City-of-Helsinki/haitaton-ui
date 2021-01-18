import React from 'react';
import { useTranslation } from 'react-i18next';
import HankeDrawer from '../../map/HankeDrawer';
import { FormProps, FORMFIELD } from '../../types/hanke';
import H2 from '../../../common/components/text/H2';

const Form1: React.FC<FormProps> = ({ formData }) => {
  const { t } = useTranslation();
  return (
    <div className="form1">
      <H2 data-testid="hankkeenAlue">{t('hankeForm:hankkeenAlueForm:header')}</H2>
      <div style={{ position: 'relative' }}>
        <HankeDrawer hankeTunnus={formData[FORMFIELD.TUNNUS]} />
      </div>
    </div>
  );
};
export default Form1;
