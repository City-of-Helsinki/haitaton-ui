import React from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from './PropTypes';

const Form3: React.FC<PropTypes> = (props) => {
  const { t } = useTranslation();
  return (
    <div className="form3">
      <h2>{t('hankeForm:tyomaanTiedotForm:header')}</h2>
    </div>
  );
};
export default Form3;
