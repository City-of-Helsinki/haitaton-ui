import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import H1 from '../../../common/components/text/H1';

import { combineObj } from './utils';
import { HankeDataDraft, HANKE_SAVETYPE } from './types';
import { getFormData } from './selectors';

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
  const formData = useSelector(getFormData());

  const wizardStateData = [
    { label: t('hankeForm:perustiedotForm:header'), view: 0 },
    { label: t('hankeForm:hankkeenAlueForm:header'), view: 1 },
    { label: t('hankeForm:hankkeenYhteystiedotForm:header'), view: 2 },
    { label: t('hankeForm:tyomaanTiedotForm:header'), view: 3 },
    { label: t('hankeForm:hankkeenHaitatForm:header'), view: 4 },
  ];
  const [formPage, setFormPage] = useState<number>(0);

  const { handleSubmit, errors, control, register } = useForm<HankeDataDraft>({
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

  const onSubmit = async (values: HankeDataDraft) => {
    const data = combineObj(formData, values);

    console.log({ data });

    if (data) {
      dispatch(actions.updateFormData(data));
      try {
        dispatch(
          saveForm({
            data,
            saveType: HANKE_SAVETYPE.DRAFT,
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
            {formPage === 0 && (
              <Form0 errors={errors} control={control} register={register} formData={formData} />
            )}
            {formPage === 1 && (
              <Form1 errors={errors} control={control} register={register} formData={formData} />
            )}
            {formPage === 2 && (
              <Form2 errors={errors} control={control} register={register} formData={formData} />
            )}
            {formPage === 3 && (
              <Form3 errors={errors} control={control} register={register} formData={formData} />
            )}
            {formPage === 4 && (
              <Form4 errors={errors} control={control} register={register} formData={formData} />
            )}
            <div className="btnWpr">
              {formPage < 4 && (
                <button className="btnWpr--next" type="submit">
                  <span>{t('hankeForm:nextButton')}</span>
                </button>
              )}
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
