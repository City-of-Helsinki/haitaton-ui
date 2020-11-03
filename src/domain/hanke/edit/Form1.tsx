import React, { Dispatch, SetStateAction } from 'react';
import { Button } from 'hds-react';
import { useTranslation } from 'react-i18next';

interface IProps {
  changeWizardView: Dispatch<SetStateAction<number>>;
}

const Form1: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const { changeWizardView } = props;
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
