import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Indicator from './indicator';
import FormViewer from './FormViewer';

import './Form.styles.scss';

const FormComponent: React.FC = (props) => {
  const { t } = useTranslation();

  const dummyData = [
    { label: t('hankeForm:perustiedotForm:header'), view: 0 },
    { label: t('hankeForm:hankkeenAlueForm:header'), view: 1 },
    { label: t('hankeForm:hankkeenYhteystiedotForm:header'), view: 2 },
    { label: t('hankeForm:tyomaanTiedotForm:header'), view: 3 },
    { label: t('hankeForm:hankkeenHaitatForm:header'), view: 4 },
  ];
  const [viewStatus, setviewStatus] = useState(0);
  return (
    <div className="hankeForm">
      <h1>{t('hankeForm:pageHeader')}</h1>
      <div className="hankeForm__formWpr">
        <Indicator dataList={dummyData} view={viewStatus} />
        <FormViewer changeWizardView={setviewStatus} view={viewStatus} />
      </div>
    </div>
  );
};
export default FormComponent;
