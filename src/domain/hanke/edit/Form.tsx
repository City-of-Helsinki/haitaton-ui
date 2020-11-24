import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import H1 from '../../../common/components/text/H1';

import { combineObj } from './utils';
import { HankeDataDraft } from './types';
import { getFormData } from './selectors';

import { actions } from './reducer';
import { saveForm } from './thunks';

import Indicator from './indicator';
import ConfirmationDialog from './ConfirmationDialog';

import Form0 from './Form0';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';

import './Form.styles.scss';
import './Dialog.styles.scss';

const FormComponent: React.FC = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formData = useSelector(getFormData());

  const wizardStateData = [
    { label: t('hankeForm:perustiedotForm:header'), view: 0 },
    { label: t('hankeForm:hankkeenAlueForm:header'), view: 1 },
    { label: t('hankeForm:hankkeenYhteystiedotForm:header'), view: 2 },
    { label: t('hankeForm:tyomaanTiedotForm:header'), view: 3 },
    { label: t('hankeForm:hankkeenHaitatForm:header'), view: 4 },
  ];
  const [formPage, setFormPage] = useState<number>(0);

  const { handleSubmit, errors, control, register, formState } = useForm<HankeDataDraft>({
    mode: 'all',
    reValidateMode: 'onBlur',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
    defaultValues: formData,
  });

  function goBack() {
    setFormPage((v) => v - 1);
    return false;
  }
  function tallennaLuonnos() {
    console.log('went luonnos');
    return false;
  }

  const onSubmit = async (values: HankeDataDraft) => {
    console.log('test', JSON.stringify(values) === JSON.stringify(formData));
    const data = combineObj(formData, values);

    if (data) {
      dispatch(actions.updateFormData(data));
      try {
        dispatch(
          saveForm({
            data,
          })
        );
        setFormPage((v) => v + 1);
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
        <Indicator dataList={wizardStateData} view={formPage} />
        <div className="hankeForm__formWprRight">
          <form name="hanke" onSubmit={handleSubmit(onSubmit)}>
            <ConfirmationDialog />
            {formPage === 0 && <Form0 errors={errors} control={control} register={register()} />}
            {formPage === 1 && <Form1 errors={errors} control={control} register={register()} />}
            {formPage === 2 && <Form2 errors={errors} control={control} register={register()} />}
            {formPage === 3 && <Form3 errors={errors} control={control} register={register()} />}
            {formPage === 4 && <Form4 errors={errors} control={control} register={register()} />}
            <div className="btnWpr">
              {formPage < 4 && (
                <button className="btnWpr--next" type="submit" disabled={formState.isValid}>
                  <span>{t('hankeForm:nextButton')}</span>
                </button>
              )}
              <button
                className="btnWpr--tallennaLuonnos"
                type="submit"
                onClick={() => tallennaLuonnos()}
                disabled={formState.isValid}
              >
                <span>{t('hankeForm:tallennaLuonnosButton')}</span>
              </button>
              {formPage > 0 && (
                <button className="btnWpr--previous" type="button" onClick={() => goBack()}>
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
