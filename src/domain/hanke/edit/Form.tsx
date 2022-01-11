import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { IconCross } from 'hds-react/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import Text from '../../../common/components/text/Text';
import { HankeDataFormState, SaveFormArguments } from './types';
import FormStepIndicator from './FormStepIndicator';
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
  onSaveGeometry: (hankeTunnus: string) => void;
  onIsDirtyChange: (isDirty: boolean) => void;
  onUnmount: () => void;
  onFormClose: () => void;
};

const HankeForm: React.FC<Props> = ({
  formData,
  onSave,
  onSaveGeometry,
  onIsDirtyChange,
  onUnmount,
  onFormClose,
}) => {
  const { t } = useTranslation();
  const [currentFormPage, setCurrentFormPage] = useState<number>(0);
  const formContext = useForm<HankeDataFormState>({
    mode: 'all',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
    shouldUnregister: false,
    defaultValues: formData,
    resolver: yupResolver(hankeSchema),
    context: {
      currentFormPage,
    },
  });

  const { errors, control, register, formState, getValues, reset } = formContext;

  useEffect(() => {
    reset(formData);
  }, [formData]);

  const saveDraft = useCallback(() => {
    onSave({
      data: getValues(),
      currentFormPage,
    });
  }, [getValues, currentFormPage]);

  const goBack = useCallback(() => {
    setCurrentFormPage((v) => v - 1);
  }, []);

  const goForward = useCallback(() => {
    if (currentFormPage === 0) {
      saveDraft();
    }
    if (currentFormPage === 1) {
      const values = getValues();
      if (values.hankeTunnus) {
        onSaveGeometry(values.hankeTunnus);
      }
    }
    setCurrentFormPage((v) => v + 1);
  }, [getValues, currentFormPage]);

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
          <FormStepIndicator currentFormPage={currentFormPage} formData={formData} />
          <div className="hankeForm__formWprRight">
            <form name="hanke">
              <div className="closeFormWpr">
                <button
                  type="button"
                  onClick={() => onFormClose()}
                  aria-label={t('hankeForm:closeAriaLabel')}
                >
                  <IconCross aria-hidden="true" />
                </button>
              </div>

              {currentFormPage === 0 && (
                <Form0 errors={errors} control={control} register={register} formData={formData} />
              )}
              {currentFormPage === 1 && (
                <Form1 errors={errors} control={control} register={register} formData={formData} />
              )}
              {currentFormPage === 2 && (
                <Form2 errors={errors} control={control} register={register} formData={formData} />
              )}
              {currentFormPage === 3 && (
                <Form3 errors={errors} control={control} register={register} formData={formData} />
              )}
              {currentFormPage === 4 && (
                <Form4 errors={errors} control={control} register={register} formData={formData} />
              )}
              <FormButtons
                goBack={goBack}
                goForward={goForward}
                saveDraft={saveDraft}
                currentFormPage={currentFormPage}
              />
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
export default HankeForm;
