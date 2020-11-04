import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import Indicator from './indicator';

import Form0 from './Form0';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';

import './Form.styles.scss';

type Inputs = {
  hankeenTunnus: string;
  hankeenNimi: string;
  hankeenVaihe: string;
  endDate: string;
  omistajaOrganisaatio: string;
  omistajaOsasto: string;
  arvioijaOrganisaatio: string;
  arvioijaOsasto: string;
};
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
  const { handleSubmit, errors, control, getValues } = useForm<Inputs>({
    mode: 'all',
    reValidateMode: 'onBlur',
    resolver: undefined,
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
  });
  const onSubmit = (data: Inputs) => {
    // eslint-disable-next-line
    console.log('data', data);
    // eslint-disable-next-line
    console.log('form values', getValues());
  };
  return (
    <div className="hankeForm">
      <h1>{t('hankeForm:pageHeader')}</h1>
      <div className="hankeForm__formWpr">
        <Indicator dataList={dummyData} view={viewStatus} />
        <div className="hankeForm__formWprRight">
          <form name="hanke" onSubmit={handleSubmit(onSubmit)}>
            {viewStatus === 0 && (
              <Form0 changeWizardView={setviewStatus} errors={errors} control={control} />
            )}
            {viewStatus === 1 && <Form1 changeWizardView={setviewStatus} />}
            {viewStatus === 2 && (
              <Form2 changeWizardView={setviewStatus} errors={errors} control={control} />
            )}
            {viewStatus === 3 && <Form3 changeWizardView={setviewStatus} />}
            {viewStatus === 4 && <Form4 changeWizardView={setviewStatus} />}
            <button type="submit">validate</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default FormComponent;
