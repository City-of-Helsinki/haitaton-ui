import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import H1 from '../../../common/components/text/H1';

import { combineObj } from './utils';
import { HankeData } from './types';
import { getFormData, getRequestStatus } from './selectors';

import { actions } from './reducer';
import { saveForm } from './thunks';

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
  const status = useSelector(getRequestStatus);

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

  function goBack(view: number) {
    const values = combineObj(getValues(), formData);
    if (!values) return null;
    dispatch(actions.updateFormData(values));

    changeWizardView(viewStatusVar);
    setviewStatusVar(view);
    return false;
  }

  const onSubmit = async (values: HankeData) => {
    const data = combineObj(values, formData);

    if (data) {
      dispatch(actions.updateFormData(data));
      try {
        await dispatch(
          saveForm({
            data,
          })
        );
        changeWizardView(viewStatusVar);
      } catch (e) {
        // eslint-disable-next-line
        console.error(e.message);
      }
    }
  };
  return (
    <div className="hankeForm">
      <H1 stylesAs="h2">{t('hankeForm:pageHeader')}</H1>
      <div className="hankeForm__formWpr">
        <Indicator dataList={wizardStateData} view={WizardView} />
        <div className="hankeForm__formWprRight">
          <form name="hanke" onSubmit={handleSubmit(onSubmit)}>
            {!!status && <p>Lomakkeen tiedot tallennettu</p>}
            {WizardView === 0 && <Form0 errors={errors} control={control} register={register()} />}
            {WizardView === 1 && <Form1 />}
            {WizardView === 2 && <Form2 errors={errors} control={control} />}
            {WizardView === 3 && <Form3 />}
            {WizardView === 4 && <Form4 />}
            <div className="btnWpr">
              {WizardView < 4 && (
                <button
                  className="btnWpr--next"
                  type="submit"
                  onClick={() => setviewStatusVar(WizardView + 1)}
                >
                  <span>{t('hankeForm:nextButton')}</span>
                </button>
              )}
              {WizardView > 0 && (
                <button
                  className="btnWpr--previous"
                  type="submit"
                  onClick={() => goBack(WizardView - 1)}
                >
                  <span>{t('hankeForm:previousButton')}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default FormComponent;
