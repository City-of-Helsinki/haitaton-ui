import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { Button, IconCross, IconPlusCircle, IconSaveDiskette, StepState } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FORMFIELD, FormNotification, HankeDataFormState } from './types';
import { hankeSchema } from './hankeSchema';
import HankeFormAlueet from './HankeFormAlueet';
import HankeFormPerustiedot from './HankeFormPerustiedot';
import HankeFormYhteystiedot from './HankeFormYhteystiedot';
import HankeFormHaitat from './HankeFormHaitat';
import HankeFormSummary from './HankeFormSummary';
import FormNotifications from './components/FormNotifications';
import './HankeForm.styles.scss';
import { HankeData } from '../../types/hanke';
import { convertFormStateToHankeData } from './utils';
import api from '../../api/api';
import MultipageForm from '../../forms/MultipageForm';
import FormActions from '../../forms/components/FormActions';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import ApplicationAddDialog from '../../application/components/ApplicationAddDialog';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';
import { changeFormStep } from '../../forms/utils';

async function saveHanke(data: HankeDataFormState) {
  const requestData = {
    ...convertFormStateToHankeData(data),
  };

  const response = data.hankeTunnus
    ? await api.put<HankeDataFormState>(`/hankkeet/${data.hankeTunnus}`, requestData)
    : await api.post<HankeDataFormState>(`/hankkeet`, requestData);

  return response.data;
}

type Props = {
  formData: HankeDataFormState;
  onIsDirtyChange: (isDirty: boolean) => void;
  onFormClose: (hankeTunnus?: string) => void;
  children: React.ReactNode;
};

const HankeForm: React.FC<React.PropsWithChildren<Props>> = ({
  formData,
  onIsDirtyChange,
  onFormClose,
  children,
}) => {
  const { t } = useTranslation();
  const { HANKEPORTFOLIO } = useLocalizedRoutes();
  const navigate = useNavigate();
  const { setNotification } = useGlobalNotification();
  const [showNotification, setShowNotification] = useState<FormNotification | null>(null);
  const [showAddApplicationDialog, setShowAddApplicationDialog] = useState(false);
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
    formState: { errors, isDirty },
    getValues,
    setValue,
    trigger,
  } = formContext;

  const isNewHanke = !formData.hankeTunnus;

  const formValues = getValues();
  const isHankePublic = formValues.status === 'PUBLIC';
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
    onSuccess(data) {
      setValue('hankeTunnus', data.hankeTunnus);
      setValue('tormaystarkasteluTulos', data.tormaystarkasteluTulos);
      setValue('status', data.status);
      setShowNotification('success');
    },
  });

  function save() {
    hankeMutation.mutate(getValues());
  }

  function saveAndQuit() {
    hankeMutation.mutate(getValues(), {
      onSuccess(data) {
        setNotification(true, {
          position: 'top-right',
          dismissible: true,
          autoClose: true,
          autoCloseDuration: 8000,
          label: t('hankeForm:saveAndQuitSuccessHeader'),
          message: t('hankeForm:saveAndQuitSuccessText', {
            name: data.nimi,
            hankeTunnus: data.hankeTunnus,
          }),
          type: 'success',
          closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
        });
        navigate(`${HANKEPORTFOLIO.path}/${data.hankeTunnus}`);
      },
    });
  }

  function saveAndAddApplication() {
    save();
    setShowAddApplicationDialog(true);
  }

  function closeAddApplicationDialog() {
    setShowAddApplicationDialog(false);
  }

  useEffect(() => {
    onIsDirtyChange(isDirty);
  }, [isDirty, onIsDirtyChange]);

  const formSteps = [
    {
      element: <HankeFormPerustiedot errors={errors} register={register} formData={formValues} />,
      label: t('hankeForm:perustiedotForm:header'),
      state: StepState.available,
    },
    {
      element: <HankeFormAlueet errors={errors} register={register} formData={formValues} />,
      label: t('hankeForm:hankkeenAlueForm:header'),
      state: isNewHanke ? StepState.disabled : StepState.available,
    },
    {
      element: <HankeFormHaitat formData={formValues} />,
      label: t('hankeForm:hankkeenHaitatForm:header'),
      state: isNewHanke ? StepState.disabled : StepState.available,
    },
    {
      element: <HankeFormYhteystiedot errors={errors} register={register} formData={formValues} />,
      label: t('form:yhteystiedot:header'),
      state: isNewHanke ? StepState.disabled : StepState.available,
    },
    {
      element: <HankeFormSummary formData={formValues} />,
      label: t('hankeForm:hankkeenYhteenvetoForm:header'),
      state: isNewHanke ? StepState.disabled : StepState.available,
    },
  ];

  return (
    <FormProvider {...formContext}>
      <FormNotifications showNotification={showNotification} />
      <ApplicationAddDialog
        isOpen={showAddApplicationDialog}
        onClose={closeAddApplicationDialog}
        hanke={getValues() as HankeData}
      />
      <div className="hankeForm">
        <MultipageForm heading={formHeading} formSteps={formSteps} onStepChange={save}>
          {function renderFormActions(activeStep, handlePrevious, handleNext) {
            const lastStep = activeStep === formSteps.length - 1;

            const handleNextPage = () =>
              activeStep === 0
                ? changeFormStep(handleNext, [FORMFIELD.NIMI], trigger)
                : handleNext();

            return (
              <FormActions
                activeStepIndex={activeStep}
                totalSteps={formSteps.length}
                onPrevious={handlePrevious}
                onNext={handleNextPage}
              >
                {isNewHanke && (
                  <Button
                    variant="danger"
                    iconLeft={<IconCross aria-hidden />}
                    onClick={() => onFormClose(formValues.hankeTunnus)}
                  >
                    {t('hankeForm:cancelButton')}
                  </Button>
                )}
                {!lastStep && (
                  <Button
                    variant="supplementary"
                    iconLeft={<IconSaveDiskette aria-hidden="true" />}
                    onClick={saveAndQuit}
                    data-testid="save-form-btn"
                    isLoading={hankeMutation.isLoading}
                    loadingText={t('common:buttons:savingText')}
                  >
                    {t('hankeForm:saveDraftButton')}
                  </Button>
                )}
                {lastStep && (
                  <>
                    {isHankePublic && (
                      <Button
                        variant="secondary"
                        iconLeft={<IconPlusCircle aria-hidden />}
                        onClick={saveAndAddApplication}
                      >
                        {t('hankeForm:saveAndAddButton')}
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      iconLeft={<IconSaveDiskette aria-hidden />}
                      onClick={saveAndQuit}
                      isLoading={hankeMutation.isLoading}
                      loadingText={t('common:buttons:savingText')}
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
