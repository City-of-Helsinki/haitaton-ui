import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { IconCross } from 'hds-react/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import Text from '../../../common/components/text/Text';
import { HankeDataFormState, SaveFormArguments } from './types';
import StateIndicator from './StateIndicator';
import { hankeSchema } from './hankeSchema';
import Form0 from './Form0';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';
import FormButtons from './FormButtons';
import FormNotifications from './FormNotifications';
import './Form.styles.scss';

type Props = {
  formData: HankeDataFormState;
  onSave: (args: SaveFormArguments) => void;
  onSubmit: (data: HankeDataFormState) => void;
  onSaveGeometry: (hankeTunnus: string) => void;
  onIsDirtyChange: (isDirty: boolean) => void;
  onUnmount: () => void;
  onFormClose: () => void;
};

const HankeForm: React.FC<Props> = ({
  formData,
  onSave,
  onSubmit,
  onSaveGeometry,
  onIsDirtyChange,
  onUnmount,
  onFormClose,
}) => {
  const { t } = useTranslation();
  const [formPage, setFormPage] = useState<number>(0);
  const formContext = useForm<HankeDataFormState>({
    mode: 'all',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
    shouldUnregister: false,
    defaultValues: formData,
    resolver: yupResolver(hankeSchema),
    context: {
      formPage,
    },
  });

  const { handleSubmit, errors, control, register, formState, getValues, reset } = formContext;

  useEffect(() => {
    reset(formData);
  }, [formData]);

  const saveDraft = useCallback(() => {
    onSave({
      data: getValues(),
      formPage,
    });
  }, [getValues, formPage]);

  const goBack = useCallback(() => {
    setFormPage((v) => v - 1);
  }, []);

  const goForward = useCallback(() => {
    if (formPage === 0) {
      saveDraft();
    }
    if (formPage === 1) {
      const values = getValues();
      if (values.hankeTunnus) {
        onSaveGeometry(values.hankeTunnus);
      }
    }
    setFormPage((v) => v + 1);
  }, [getValues, formPage]);

  useEffect(() => {
    onIsDirtyChange(formState.isDirty);
  }, [formState.isDirty]);

  useEffect(() => {
    return () => onUnmount();
  }, []);

  return (
    <FormProvider {...formContext}>
      <FormNotifications />
      <div className="hankeForm">
        <Text tag="h1" data-testid="formPageHeader" styleAs="h2" spacing="s" weight="bold">
          {t('hankeForm:pageHeader')}
        </Text>

        <div className="hankeForm__formWpr">
          <StateIndicator formPage={formPage} />
          <div className="hankeForm__formWprRight">
            <form name="hanke" onSubmit={handleSubmit(onSubmit)}>
              <div className="closeFormWpr">
                <button
                  type="button"
                  onClick={() => onFormClose()}
                  aria-label={t('hankeForm:closeAriaLabel')}
                >
                  <IconCross aria-hidden="true" />
                </button>
              </div>
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
              <FormButtons
                goBack={goBack}
                goForward={goForward}
                saveDraft={saveDraft}
                formPage={formPage}
              />
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
export default HankeForm;
