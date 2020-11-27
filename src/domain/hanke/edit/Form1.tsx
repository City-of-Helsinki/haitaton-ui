import React from 'react';
import { useTranslation } from 'react-i18next';
import HankeDrawer from '../../map/HankeDrawer';
import { FormProps } from './types';
import H2 from '../../../common/components/text/H2';

const Form1: React.FC<FormProps> = (props) => {
  const { t } = useTranslation();
  return (
    <div className="form1">
      <H2>{t('hankeForm:hankkeenAlueForm:header')}</H2>
      <div style={{ position: 'relative' }}>
        <HankeDrawer />
      </div>
    </div>
  );
};
export default Form1;
