import React, { useState, useEffect, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from 'hds-react';
import { IconCross, IconTrash } from 'hds-react/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import Text from '../../../common/components/text/Text';
import { FormNotification, HankeDataFormState } from './types';
import FormStepIndicator from './components/FormStepIndicator';
import { hankeSchema } from './hankeSchema';
import Form0 from './HankeForm0';
import Form1 from './HankeForm1';
import Form2 from './HankeForm2';
import FormButtons from './components/FormButtons';
import FormNotifications from './components/FormNotifications';
import './HankeForm.styles.scss';
import { HANKE_SAVETYPE } from '../../types/hanke';
import { filterEmptyContacts, isHankeEditingDisabled } from './utils';
import api from '../../api/api';

async function saveHanke(data: HankeDataFormState, saveType = HANKE_SAVETYPE.DRAFT) {
  const requestData = {
    ...filterEmptyContacts(data),
    saveType,
  };

  if (isHankeEditingDisabled(data)) {
    throw new Error('Editing disabled');
  }

  if (data.hankeTunnus && data.geometriat) {
    await api.post(`/hankkeet/${data.hankeTunnus}/geometriat`, {
      featureCollection: data.geometriat,
    });
  }

  const response = data.hankeTunnus
    ? await api.put<HankeDataFormState>(`/hankkeet/${data.hankeTunnus}`, requestData)
    : await api.post<HankeDataFormState>(`/hankkeet`, requestData);

  return response.data;
}

type Props = {
  formData: HankeDataFormState;
  onIsDirtyChange: (isDirty: boolean) => void;
  onFormClose: () => void;
  onOpenHankeDelete: () => void;
  children: React.ReactNode;
};

const HankeForm: React.FC<Props> = ({
  formData,
  onIsDirtyChange,
  onFormClose,
  onOpenHankeDelete,
  children,
}) => {
  const [currentFormPage, setCurrentFormPage] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<FormNotification | null>(null);
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

  const {
    register,
    formState: { errors, isDirty },
    getValues,
    reset,
  } = formContext;

  const hankeMutation = useMutation(saveHanke, {
    onMutate() {
      setShowNotification(null);
    },
    onError() {
      setShowNotification('error');
    },
    onSuccess() {
      setShowNotification('success');
    },
  });

  useEffect(() => {
    if (hankeMutation.data) {
      // Update form data with API response
      reset(hankeMutation.data);
    }
  }, [hankeMutation.data, reset]);

  const saveDraft = useCallback(() => {
    hankeMutation.mutate(getValues());
  }, [getValues, hankeMutation]);

  const goBack = useCallback(() => {
    setCurrentFormPage((v) => v - 1);
  }, []);

  const goForward = useCallback(() => {
    if (currentFormPage === 0) {
      saveDraft();
    }

    setCurrentFormPage((v) => v + 1);
  }, [currentFormPage, saveDraft]);

  useEffect(() => {
    onIsDirtyChange(isDirty);
  }, [isDirty, onIsDirtyChange]);

  return (
    <FormProvider {...formContext}>
      <FormNotifications showNotification={showNotification} />
      <div className="hankeForm">
        <Text tag="h1" data-testid="formPageHeader" styleAs="h2" spacing="s" weight="bold">
          &nbsp;
        </Text>

        <div className="hankeForm__formWpr">
          <FormStepIndicator
            currentFormPage={currentFormPage}
            formData={getValues()}
            isSaving={hankeMutation.isLoading}
          />
          <div className="hankeForm__formWprRight">
            <form name="hanke">
              <div className="closeFormWpr">
                {formData.hankeTunnus && (
                  <Button
                    className="deleteHankeBtn"
                    onClick={() => onOpenHankeDelete()}
                    variant="supplementary"
                    iconLeft={<IconTrash aria-hidden />}
                  >
                    Poista hanke
                  </Button>
                )}
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
                <Form0 errors={errors} register={register} formData={formData} />
              )}
              {currentFormPage === 1 && (
                <Form1 errors={errors} register={register} formData={formData} />
              )}
              {currentFormPage === 2 && (
                <Form2 errors={errors} register={register} formData={formData} />
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
