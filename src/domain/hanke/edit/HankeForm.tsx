import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from 'hds-react';
import { IconCross, IconCrossCircle } from 'hds-react/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import Text from '../../../common/components/text/Text';
import { HankeDataFormState, SaveFormArguments } from './types';
import FormStepIndicator from './components/FormStepIndicator';
import { hankeSchema } from './hankeSchema';
import Form0 from './HankeForm0';
import Form1 from './HankeForm1';
import Form2 from './HankeForm2';
import Form3 from './HankeForm3';
import Form4 from './HankeForm4';
import FormButtons from './components/FormButtons';
import FormNotifications from './components/FormNotifications';
import './HankeForm.styles.scss';

type Props = {
  formData: HankeDataFormState;
  onSave: (args: SaveFormArguments) => void;
  onSaveGeometry: (hankeTunnus: string) => void;
  onIsDirtyChange: (isDirty: boolean) => void;
  onUnmount: () => void;
  onFormClose: () => void;
  isSaving: boolean;
  onOpenHankeDelete: () => void;
  children: React.ReactNode;
};

const HankeForm: React.FC<Props> = ({
  formData,
  onSave,
  onSaveGeometry,
  onIsDirtyChange,
  onUnmount,
  onFormClose,
  isSaving,
  onOpenHankeDelete,
  children,
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
          <FormStepIndicator
            currentFormPage={currentFormPage}
            formData={formData}
            isSaving={isSaving}
          />
          <div className="hankeForm__formWprRight">
            <form name="hanke">
              <div className="closeFormWpr">
                <Button
                  className="delteHankeBtn"
                  onClick={() => onOpenHankeDelete()}
                  variant="supplementary"
                  theme="coat"
                  iconLeft={<IconCrossCircle aria-hidden />}
                >
                  Poista hanke
                </Button>
                <Button
                  className="closeFormBtn"
                  onClick={() => onFormClose()}
                  variant="supplementary"
                  theme="coat"
                  iconLeft={<IconCross aria-hidden="true" />}
                >
                  Keskeytä
                </Button>
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
      {children}
    </FormProvider>
  );
};
export default HankeForm;
