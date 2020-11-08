import React from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from './PropTypes';

const Form1: React.FC<PropTypes> = (props) => {
  const { t } = useTranslation();
  return (
    <div className="form1">
      <h2>{t('hankeForm:hankkeenAlueForm:header')}</h2>
    </div>
  );
};
export default Form1;
