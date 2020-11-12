import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'hds-react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { HankeData } from './types';
import { getFormData } from './selectors';

import { actions } from './reducer';
import { saveFormData } from './thunks';

import Indicator from './indicator';

import Form0 from './Form0';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';

import './Form.styles.scss';

const FormComponent: React.FC = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formData = useSelector(getFormData);
  const wizardStateData = [
    { label: t('hankeForm:perustiedotForm:header'), view: 0 },
    { label: t('hankeForm:hankkeenAlueForm:header'), view: 1 },
    { label: t('hankeForm:hankkeenYhteystiedotForm:header'), view: 2 },
    { label: t('hankeForm:tyomaanTiedotForm:header'), view: 3 },
    { label: t('hankeForm:hankkeenHaitatForm:header'), view: 4 },
  ];
  const [WizardView, changeWizardView] = useState(0);
  const [viewStatusVar, setviewStatusVar] = useState(0);

  const { handleSubmit, errors, control, register, getValues } = useForm<HankeData>({
    mode: 'all',
    reValidateMode: 'onBlur',
    resolver: undefined,
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
  });
  function combineState(data: HankeData) {
    return { ...formData, ...data };
  }
  function goBack(view: number) {
    const values = combineState(getValues());
    dispatch(actions.updateFormData(values));

    changeWizardView(viewStatusVar);
    setviewStatusVar(view);
  }

  const onSubmit = async (values: HankeData) => {
    const data = combineState(values);
    dispatch(actions.updateFormData(data));
    try {
      await dispatch(
        saveFormData({
          data: values,
        })
      );
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message);
    }

    changeWizardView(viewStatusVar);
  };
  return (
    <div className="hankeForm">
      <h1>{t('hankeForm:pageHeader')}</h1>
      <div className="hankeForm__formWpr">
        <Indicator dataList={wizardStateData} view={WizardView} />
        <div className="hankeForm__formWprRight">
          <form name="hanke" onSubmit={handleSubmit(onSubmit)}>
            {WizardView === 0 && <Form0 errors={errors} control={control} register={register()} />}
            {WizardView === 1 && <Form1 />}
            {WizardView === 2 && <Form2 errors={errors} control={control} />}
            {WizardView === 3 && <Form3 />}
            {WizardView === 4 && <Form4 />}
            <div className="btnWpr">
              {WizardView > 0 && (
                <Button type="submit" onClick={() => goBack(WizardView - 1)}>
                  {t('hankeForm:previousButton')}
                </Button>
              )}
              {WizardView < 4 && (
                <Button type="submit" onClick={() => setviewStatusVar(WizardView + 1)}>
                  {t('hankeForm:nextButton')}{' '}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default FormComponent;
