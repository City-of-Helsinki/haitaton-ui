import React from 'react';
import { useTranslation } from 'react-i18next';
import H2 from '../../../common/components/text/H2';

const FinishedForm: React.FC = () => {
  const { t } = useTranslation();
  return <H2>{t('hankeForm:finishedForm:header')}</H2>;
};
export default FinishedForm;
