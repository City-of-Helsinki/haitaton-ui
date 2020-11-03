import React, { Dispatch, SetStateAction } from 'react';
import { Button } from 'hds-react';
import { useTranslation } from 'react-i18next';

interface IProps {
  changeWizardView: Dispatch<SetStateAction<number>>;
}

const Form4: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const { changeWizardView } = props;
  return (
    <div className="form4">
      <h2>{t('hankeForm:hankkeenHaitatForm:header')}</h2>
      <Button type="button" onClick={() => changeWizardView(3)}>
        {t('hankeForm:previousButton')}
      </Button>
      <Button type="button">Save</Button>
    </div>
  );
};
export default Form4;
