import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IconCross } from 'hds-react/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import H1 from '../../../common/components/text/H1';
import { actions as dialogActions } from '../../../common/components/confirmationDialog/reducer';
import { getFormData, getHasFormChanged } from './selectors';
import { HankeDataDraft, HANKE_SAVETYPE } from './types';
import { actions, hankeDataDraft } from './reducer';
import { saveForm } from './thunks';
import Indicator from './indicator';
import { hankeSchema } from './validations';
import Form0 from './Form0';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';
import FormButtons from './FormButtons';
import FinishedForm from './FinishedForm';

import './Form.styles.scss';

const FormComponent: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formData = useSelector(getFormData());
  const hasFormChanged = useSelector(getHasFormChanged());
  const history = useHistory();

  const wizardStateData = [
    { label: t('hankeForm:perustiedotForm:header'), view: 0 },
    { label: t('hankeForm:hankkeenAlueForm:header'), view: 1 },
    { label: t('hankeForm:hankkeenYhteystiedotForm:header'), view: 2 },
    { label: t('hankeForm:tyomaanTiedotForm:header'), view: 3 },
    { label: t('hankeForm:hankkeenHaitatForm:header'), view: 4 },
  ];
  const [formPage, setFormPage] = useState<number>(0);

  const formContext = useForm<HankeDataDraft>({
    mode: 'all',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    shouldFocusError: false,
    shouldUnregister: false,
    defaultValues: formData,
    resolver: yupResolver(hankeSchema),
    context: {
      formPage,
    },
  });

  const {
    handleSubmit,
    errors,
    control,
    register,
    formState,
    getValues,
    // reset,
    trigger,
  } = formContext;

  useEffect(() => {
    // reset(formData);
    // trigger();
  }, [formData]);

  const saveDraft = useCallback(() => {
    dispatch(
      saveForm({
        data: getValues(),
        saveType: HANKE_SAVETYPE.DRAFT,
      })
    );
  }, [getValues]);

  const goBack = useCallback(() => {
    setFormPage((v) => v - 1);
    // Dirty fix to trigger validations after pageChage
    setTimeout(() => trigger(), 1);
  }, []);

  const goForward = useCallback(() => {
    if (formPage === 0) {
      saveDraft();
    }
    setFormPage((v) => v + 1);
    // Dirty fix to trigger validations after pageChage
    setTimeout(() => trigger(), 1);
  }, [formPage]);

  const closeForm = useCallback(() => {
    if (hasFormChanged) {
      dispatch(dialogActions.updateIsDialogOpen({ isDialogOpen: true, redirectUrl: '/' }));
    } else {
      history.push('/');
    }
  }, [hasFormChanged]);

  const onSubmit = async (data: HankeDataDraft) => {
    // eslint-disable-next-line
    console.log(data);
    // Todo: Maybe save and redirect to haittojenHallinta?
  };

  useEffect(() => {
    dispatch(actions.updateHasFormChanged(formState.isDirty));
  }, [formState.isDirty]);

  // Clear form data on unmount
  useEffect(() => {
    return () => {
      dispatch(actions.updateFormData(hankeDataDraft));
    };
  }, []);
  console.log('data', getValues());
  return (
    <FormProvider {...formContext}>
      <div className="hankeForm">
        <H1 stylesAs="h2">{t('hankeForm:pageHeader')}</H1>
        {formPage === 5 ? (
          <div className="hankeForm__formWpr">
            <div className="hankeForm__formWprRight">
              <FinishedForm />
            </div>
          </div>
        ) : (
          <div className="hankeForm__formWpr">
            <Indicator dataList={wizardStateData} view={formPage} />
            <div className="hankeForm__formWprRight">
              <form name="hanke" onSubmit={handleSubmit(onSubmit)}>
                <div className="closeFormWpr">
                  <button type="button" onClick={() => closeForm()}>
                    <IconCross />
                  </button>
                </div>
                {formPage === 0 && (
                  <Form0
                    errors={errors}
                    control={control}
                    register={register}
                    formData={formData}
                  />
                )}
                {formPage === 1 && (
                  <Form1
                    errors={errors}
                    control={control}
                    register={register}
                    formData={formData}
                  />
                )}
                {formPage === 2 && (
                  <Form2
                    errors={errors}
                    control={control}
                    register={register}
                    formData={formData}
                  />
                )}
                {formPage === 3 && (
                  <Form3
                    errors={errors}
                    control={control}
                    register={register}
                    formData={formData}
                  />
                )}
                {formPage === 4 && (
                  <Form4
                    errors={errors}
                    control={control}
                    register={register}
                    formData={formData}
                  />
                )}
                <FormButtons
                  goBack={goBack}
                  goForward={goForward}
                  saveDraft={saveDraft}
                  formPage={formPage}
                  isValid={formState.isValid}
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
};
export default FormComponent;
