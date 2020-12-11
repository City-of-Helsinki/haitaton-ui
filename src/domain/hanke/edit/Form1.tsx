import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormProps } from './types';
import H2 from '../../../common/components/text/H2';

const Form1: React.FC<FormProps> = () => {
  const { t } = useTranslation();
  return (
    <div className="form1">
      <H2 data-testid="hankkeenAlue">{t('hankeForm:hankkeenAlueForm:header')}</H2>
    </div>
  );
};
export default Form1;
