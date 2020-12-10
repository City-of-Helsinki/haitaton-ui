import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions } from './reducer';
import H2 from '../../../common/components/text/H2';

const FinishedForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.updateFormData({}));
  }, []);
  return <H2>{t('hankeForm:finishedForm:header')}</H2>;
};
export default FinishedForm;
