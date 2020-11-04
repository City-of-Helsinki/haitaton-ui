import React from 'react';
import { Button } from 'hds-react';
import { useTranslation } from 'react-i18next';

import PropTypes from './PropTypes';

const Form3: React.FC<PropTypes> = (props) => {
  const { t } = useTranslation();
  const { changeWizardView } = props;
  return (
    <div className="form3">
      <h2>{t('hankeForm:tyomaanTiedotForm:header')}</h2>
      <Button type="button" onClick={() => changeWizardView(2)}>
        {t('hankeForm:previousButton')}
      </Button>
      <Button type="button" onClick={() => changeWizardView(4)}>
        {t('hankeForm:nextButton')}
      </Button>
    </div>
  );
};
export default Form3;
