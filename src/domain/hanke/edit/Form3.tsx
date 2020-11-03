import React, { Dispatch, SetStateAction } from 'react';
import { Button } from 'hds-react';
import { useTranslation } from 'react-i18next';

interface IProps {
  changeWizardView: Dispatch<SetStateAction<number>>;
}

const Form3: React.FC<IProps> = (props) => {
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
