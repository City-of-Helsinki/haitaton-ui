import React from 'react';
import { Button } from 'hds-react';
import { useTranslation } from 'react-i18next';

import PropTypes from './PropTypes';

const Form1: React.FC<PropTypes> = (props) => {
  const { changeWizardView } = props;

  const { t } = useTranslation();
  return (
    <div className="form1">
      <h2>{t('hankeForm:hankkeenAlueForm:header')}</h2>
      <Button type="button" onClick={() => changeWizardView(0)}>
        {t('hankeForm:previousButton')}
      </Button>
      <Button type="button" onClick={() => changeWizardView(2)}>
        {t('hankeForm:nextButton')}{' '}
      </Button>
    </div>
  );
};
export default Form1;
