import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { Button, IconCross, IconPlusCircle, IconSaveDiskette, StepState } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import VectorSource from 'ol/source/Vector';
import { FORMFIELD, FormNotification, HankeDataFormState } from './types';
import { hankeSchema } from './hankeSchema';
import HankeFormAlueet from './HankeFormAlueet';
import HankeFormPerustiedot from './HankeFormPerustiedot';
import HankeFormYhteystiedot from './HankeFormYhteystiedot';
import HankeFormHaittojenHallinta from './HankeFormHaittojenHallinta';
import HankeFormLiitteet from './HankeFormLiitteet';
import HankeFormSummary from './HankeFormSummary';
import FormNotifications from './components/FormNotifications';
import './HankeForm.styles.scss';
import { HankeData } from '../../types/hanke';
import MultipageForm from '../../forms/MultipageForm';
import FormActions from '../../forms/components/FormActions';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import ApplicationAddDialog from '../../application/components/ApplicationAddDialog';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';
import { changeFormStep } from '../../forms/utils';
import { updateHanke } from './hankeApi';
import { convertHankeAlueToFormState } from './utils';
import {
  hankeAlueetPublicSchema,
  hankePerustiedotPublicSchema,
  hankeYhteystiedotPublicSchema,
  hankkeenHaittojenHallintaPublicSchema,
} from './hankePublicSchema';
import { useValidationErrors } from '../../forms/hooks/useValidationErrors';
import HankeDraftStateNotification from './components/HankeDraftStateNotification';
import HankeFormMissingFieldsNotification from './components/MissingFieldsNotification';
import DrawProvider from '../../../common/components/map/modules/draw/DrawProvider';

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
  const [attachmentsUploading, setAttachmentsUploading] = useState(false);
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
    watch,
  } = formContext;

  const formValues = getValues();
  const watchFormValues = watch();
  const [
    nimi,
    kuvaus,
    tyomaaKatuosoite,
    vaihe,
    alueet,
    omistajat,
    rakennuttajat,
    toteuttajat,
    muut,
  ] = watch([
    'nimi',
    'kuvaus',
    'tyomaaKatuosoite',
    'vaihe',
    'alueet',
    'omistajat',
    'rakennuttajat',
    'toteuttajat',
    'muut',
  ]);
  const isHankePublic = formValues.status === 'PUBLIC';
  const formHeading = `${watch('nimi')} (${formData.hankeTunnus})`;

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const hankeMutation = useMutation(updateHanke, {
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
      setValue('alkuPvm', data.alkuPvm);
      setValue('loppuPvm', data.loppuPvm);
      setValue('alueet', data.alueet?.map(convertHankeAlueToFormState));
      setShowNotification('success');
    },
  });

  const attachmentsUploadingText: string = t('common:components:fileUpload:loadingText');
  const saveAndQuitButtonIsLoading = hankeMutation.isLoading || attachmentsUploading;
  const saveAndQuitButtonLoadingText = attachmentsUploading
    ? attachmentsUploadingText
    : t('common:buttons:savingText');

  const [drawSource] = useState<VectorSource>(new VectorSource());

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

  function handleFileUpload(uploading: boolean) {
    setAttachmentsUploading(uploading);
  }

  function handleStepChange(stepIndex: number) {
    setActiveStepIndex(stepIndex);
    if (isDirty) {
      save();
    }
  }

  const formSteps = [
    {
      element: <HankeFormPerustiedot errors={errors} register={register} hanke={formValues} />,
      label: t('hankeForm:perustiedotForm:header'),
      state: StepState.available,
      validationSchema: hankePerustiedotPublicSchema,
    },
    {
      element: (
        <DrawProvider source={drawSource}>
          <HankeFormAlueet
            errors={errors}
            register={register}
            hanke={formValues}
            drawSource={drawSource}
          />
        </DrawProvider>
      ),
      label: t('hankeForm:hankkeenAlueForm:header'),
      state: StepState.available,
      validationSchema: hankeAlueetPublicSchema,
    },
    {
      element: (
        <HankeFormHaittojenHallinta errors={errors} register={register} hanke={formValues} />
      ),
      label: t('hankeForm:haittojenHallintaForm:header'),
      state: StepState.available,
      validationSchema: hankkeenHaittojenHallintaPublicSchema,
    },
    {
      element: <HankeFormYhteystiedot errors={errors} register={register} hanke={formValues} />,
      label: t('form:yhteystiedot:header'),
      state: StepState.available,
      validationSchema: hankeYhteystiedotPublicSchema,
    },
    {
      element: <HankeFormLiitteet onFileUpload={handleFileUpload} />,
      label: t('hankePortfolio:tabit:liitteet'),
      state: StepState.available,
    },
    {
      element: <HankeFormSummary formData={formValues} />,
      label: t('hankeForm:hankkeenYhteenvetoForm:header'),
      state: StepState.available,
    },
  ];

  const perustiedotErrors = useValidationErrors(hankePerustiedotPublicSchema, {
    nimi,
    kuvaus,
    tyomaaKatuosoite,
    vaihe,
  });
  const alueetErrors = useValidationErrors(hankeAlueetPublicSchema, { alueet });
  const yhteystiedotErrors = useValidationErrors(hankeYhteystiedotPublicSchema, {
    omistajat,
    rakennuttajat,
    toteuttajat,
    muut,
  });
  const formErrorsByPage = [perustiedotErrors, alueetErrors, [], yhteystiedotErrors, [], []];

  const formErrorsNotification =
    (activeStepIndex === 5 && (
      <HankeDraftStateNotification hanke={watchFormValues as HankeData} />
    )) ||
    (formErrorsByPage[activeStepIndex].length > 0 && (
      <HankeFormMissingFieldsNotification
        formErrors={formErrorsByPage[activeStepIndex]}
        getValues={getValues}
      />
    ));

  return (
    <FormProvider {...formContext}>
      <FormNotifications showNotification={showNotification} />
      <ApplicationAddDialog
        isOpen={showAddApplicationDialog}
        onClose={closeAddApplicationDialog}
        hanke={getValues() as HankeData}
      />
      <div className="hankeForm">
        <MultipageForm
          heading={formHeading}
          formSteps={formSteps}
          onStepChange={handleStepChange}
          isLoading={attachmentsUploading}
          isLoadingText={attachmentsUploadingText}
          formErrorsNotification={formErrorsNotification}
          formData={watchFormValues}
        >
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
                previousButtonIsLoading={attachmentsUploading}
                previousButtonLoadingText={attachmentsUploadingText}
                nextButtonIsLoading={attachmentsUploading}
                nextButtonLoadingText={attachmentsUploadingText}
              >
                <Button
                  variant="danger"
                  iconLeft={<IconCross aria-hidden />}
                  onClick={() => onFormClose(formValues.hankeTunnus)}
                  isLoading={attachmentsUploading}
                  loadingText={attachmentsUploadingText}
                >
                  {t('hankeForm:cancelButton')}
                </Button>
                {!lastStep && (
                  <Button
                    variant="supplementary"
                    iconLeft={<IconSaveDiskette aria-hidden="true" />}
                    onClick={saveAndQuit}
                    data-testid="save-form-btn"
                    isLoading={saveAndQuitButtonIsLoading}
                    loadingText={saveAndQuitButtonLoadingText}
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
