import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import {
  Button,
  IconCross,
  IconPlusCircle,
  IconSaveDiskette,
  IconTrash,
  StepState,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FormNotification, HankeDataFormState } from './types';
import { hankeSchema } from './hankeSchema';
import Form0 from './HankeForm0';
import Form1 from './HankeForm1';
import Form2 from './HankeForm2';
import FormNotifications from './components/FormNotifications';
import './HankeForm.styles.scss';
import { HANKE_SAVETYPE } from '../../types/hanke';
import { filterEmptyContacts, isHankeEditingDisabled } from './utils';
import api from '../../api/api';
import MultipageForm from '../../forms/MultipageForm';
import FormActions from '../../forms/components/FormActions';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import HankeHaitatForm from './HankeHaitatForm';

async function saveHanke({
  data,
  saveType = HANKE_SAVETYPE.DRAFT,
}: {
  data: HankeDataFormState;
  saveType?: HANKE_SAVETYPE;
  navigateTo?: string;
}) {
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
  onFormClose: (hankeTunnus?: string) => void;
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
  const { t } = useTranslation();
  const { HANKEPORTFOLIO } = useLocalizedRoutes();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState<FormNotification | null>(null);
  const formContext = useForm<HankeDataFormState>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
    shouldUnregister: false,
    defaultValues: formData,
    resolver: yupResolver(hankeSchema),
  });

  const {
    register,
    formState: { errors, isDirty, isValid },
    getValues,
    reset,
    handleSubmit,
  } = formContext;

  const isNewHanke = !formData.hankeTunnus;

  const formValues = getValues();
  const formHeading = isNewHanke
    ? t('hankeForm:pageHeaderNew')
    : t('hankeForm:pageHeaderEdit', { hankeTunnus: formData.hankeTunnus });

  const hankeMutation = useMutation(saveHanke, {
    onMutate() {
      setShowNotification(null);
    },
    onError() {
      setShowNotification('error');
    },
    onSuccess(data, { navigateTo }) {
      setShowNotification('success');
      if (navigateTo) {
        navigate(navigateTo);
      }
    },
  });

  useEffect(() => {
    if (hankeMutation.data) {
      // Update form data with API response
      reset(hankeMutation.data);
    }
  }, [hankeMutation.data, reset]);

  function saveDraft() {
    hankeMutation.mutate({ data: getValues() });
  }

  function saveDraftAndQuit() {
    hankeMutation.mutate({ data: getValues(), navigateTo: HANKEPORTFOLIO.path });
  }

  function save() {
    hankeMutation.mutate({
      data: getValues(),
      saveType: HANKE_SAVETYPE.SUBMIT,
      navigateTo: HANKEPORTFOLIO.path,
    });
  }

  useEffect(() => {
    onIsDirtyChange(isDirty);
  }, [isDirty, onIsDirtyChange]);

  const formSteps = [
    {
      element: <Form0 errors={errors} register={register} formData={formValues} />,
      label: t('hankeForm:perustiedotForm:header'),
      state: StepState.available,
    },
    {
      element: <Form1 errors={errors} register={register} formData={formValues} />,
      label: t('hankeForm:hankkeenAlueForm:header'),
      state: isNewHanke ? StepState.disabled : StepState.available,
    },
    {
      element: <HankeHaitatForm formData={formValues} />,
      label: t('hankeForm:hankkeenHaitatForm:header'),
      state: isNewHanke ? StepState.disabled : StepState.available,
    },
    {
      element: <Form2 errors={errors} register={register} formData={formValues} />,
      label: t('hankeForm:hankkeenYhteystiedotForm:header'),
      state: isNewHanke ? StepState.disabled : StepState.available,
    },
  ];

  return (
    <FormProvider {...formContext}>
      <FormNotifications showNotification={showNotification} />
      <div className="hankeForm">
        <MultipageForm
          heading={formHeading}
          formSteps={formSteps}
          onStepChange={saveDraft}
          onSubmit={handleSubmit(save)}
        >
          {function renderFormActions(activeStepIndex, handlePrevious, handleNext) {
            const lastStep = activeStepIndex === formSteps.length - 1;
            return (
              <FormActions
                activeStepIndex={activeStepIndex}
                totalSteps={formSteps.length}
                isFormValid={isValid}
                onPrevious={handlePrevious}
                onNext={handleNext}
              >
                {isNewHanke && (
                  <Button
                    variant="secondary"
                    iconLeft={<IconCross aria-hidden />}
                    onClick={() => onFormClose(formValues.hankeTunnus)}
                  >
                    {t('hankeForm:cancelButton')}
                  </Button>
                )}
                {!isNewHanke && (
                  <Button
                    variant="danger"
                    iconLeft={<IconTrash aria-hidden />}
                    onClick={onOpenHankeDelete}
                  >
                    {t('hankeList:buttons:delete')}
                  </Button>
                )}
                {!lastStep && (
                  <Button
                    disabled={!isValid}
                    variant="supplementary"
                    iconLeft={<IconSaveDiskette aria-hidden="true" />}
                    onClick={saveDraftAndQuit}
                    data-testid="save-form-btn"
                  >
                    {t('hankeForm:saveDraftButton')}
                  </Button>
                )}
                {lastStep && (
                  <>
                    <Button variant="secondary" iconLeft={<IconPlusCircle aria-hidden />}>
                      {t('hankeForm:saveAndAddButton')}
                    </Button>
                    <Button
                      variant="primary"
                      iconLeft={<IconSaveDiskette aria-hidden />}
                      type="submit"
                    >
                      {t('hankeForm:saveButton')}
                    </Button>
                  </>
                )}
              </FormActions>
            );
          }}
        </MultipageForm>
      </div>
      {children}
    </FormProvider>
  );
};
export default HankeForm;
