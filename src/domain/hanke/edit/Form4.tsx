import React from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from './PropTypes';

const Form4: React.FC<PropTypes> = (props) => {
  const { t } = useTranslation();
  return (
    <div className="form4">
      <h2>{t('hankeForm:hankkeenHaitatForm:header')}</h2>
    </div>
  );
};
export default Form4;
