import React from 'react';
import { useTranslation } from 'react-i18next';
import HankeDrawer from '../../map/HankeDrawer';
import { FormProps } from './types';

const Form1: React.FC<FormProps> = (props) => {
  const { t } = useTranslation();
  return (
    <div className="form1">
      <h2>{t('hankeForm:hankkeenAlueForm:header')}</h2>
      <div style={{ position: 'relative' }}>
        <HankeDrawer />
      </div>
    </div>
  );
};
export default Form1;
