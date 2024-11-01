import React, { useCallback, useMemo, useState } from 'react';
import {
  Button,
  IconCross,
  IconEnvelope,
  IconSaveDiskette,
  Notification,
  StepState,
} from 'hds-react';
import { FormProvider, useForm, FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { merge } from 'lodash';
import { useBeforeUnload } from 'react-router-dom';
import { JohtoselvitysFormValues } from './types';
import { BasicInfo } from './BasicInfo';
import Contacts from '../application/components/ApplicationContacts';
import { Geometries } from './Geometries';
import { ReviewAndSend } from './ReviewAndSend';
import MultipageForm from '../forms/MultipageForm';
import FormActions from '../forms/components/FormActions';
import { validationSchema } from './validationSchema';
import {
  convertApplicationDataToFormState,
  convertFormStateToJohtoselvitysUpdateData,
} from './utils';
import { changeFormStep, isPageValid } from '../forms/utils';
import { isApplicationDraft, isContactIn } from '../application/utils';
import { HankeData } from '../types/hanke';
import { ApplicationCancel } from '../application/components/ApplicationCancel';
import ApplicationSaveNotification from '../application/components/ApplicationSaveNotification';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';
import useHanke from '../hanke/hooks/useHanke';
import {
  AlluStatus,
  Application,
  JohtoselvitysCreateData,
  JohtoselvitysData,
  JohtoselvitysUpdateData,
  PaperDecisionReceiver,
} from '../application/types/application';
import Attachments from './Attachments';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import useAttachments from '../application/hooks/useAttachments';
import { APPLICATION_ID_STORAGE_KEY } from '../application/constants';
import { usePermissionsForHanke } from '../hanke/hankeUsers/hooks/useUserRightsForHanke';
import useSaveApplication from '../application/hooks/useSaveApplication';
import useNavigateToApplicationView from '../application/hooks/useNavigateToApplicationView';
import useSendApplication from '../application/hooks/useSendApplication';
import ApplicationSendDialog from '../application/components/ApplicationSendDialog';

type Props = {
  hankeData?: HankeData;
  application?: Application<JohtoselvitysData>;
};

const JohtoselvitysContainer: React.FC<React.PropsWithChildren<Props>> = ({
  hankeData,
  application,
}) => {
  let hanke = hankeData;
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();
  const [attachmentUploadErrors, setAttachmentUploadErrors] = useState<JSX.Element[]>([]);
  const { data: signedInUser } = usePermissionsForHanke(hanke?.hankeTunnus);

  const initialValues: JohtoselvitysFormValues = {
    id: null,
    alluStatus: null,
    applicationType: 'CABLE_REPORT',
    hankeTunnus: hanke ? hanke.hankeTunnus : null,
    applicationData: {
      applicationType: 'CABLE_REPORT',
      name: '',
      customerWithContacts: null,
      areas: [],
      startTime: null,
      endTime: null,
      workDescription: '',
      contractorWithContacts: null,
      postalAddress: { streetAddress: { streetName: '' }, city: '', postalCode: '' },
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
      constructionWork: false,
      maintenanceWork: false,
      emergencyWork: false,
      propertyConnectivity: false,
      rockExcavation: null,
    },
  };

  const formContext = useForm<JohtoselvitysFormValues>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldUnregister: false,
    defaultValues: merge(initialValues, convertApplicationDataToFormState(application)),
    resolver: yupResolver(validationSchema),
  });

  const {
    getValues,
    setValue,
    handleSubmit,
    trigger,
    formState: { isDirty },
    reset,
  } = formContext;

  // Set up a callback to save application id to session storage
  // when the page is about to be unloaded if the application
  // has been saved (id exists) and user is not editing
  // previously created application. This is done so that
  // user can be redirected to editing route if the page is refreshed.
  useBeforeUnload(
    useCallback(() => {
      const applicationId = getValues('id');
      if (applicationId && !application) {
        sessionStorage.setItem(APPLICATION_ID_STORAGE_KEY, applicationId.toString());
      }
    }, [getValues, application]),
  );

  // If application is created without hanke existing first, get generated hanke data
  // after first save when hankeTunnus is available
  const { data: generatedHanke } = useHanke(!hankeData ? getValues('hankeTunnus') : null);
  if (generatedHanke) {
    hanke = generatedHanke;
  }

  const { data: existingAttachments, isError: attachmentsLoadError } = useAttachments(
    getValues('id'),
  );

  const navigateToApplicationView = useNavigateToApplicationView();

  const [attachmentsUploading, setAttachmentsUploading] = useState(false);

  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);

  const {
    applicationCreateMutation,
    applicationUpdateMutation,
    showSaveNotification,
    setShowSaveNotification,
  } = useSaveApplication<JohtoselvitysData, JohtoselvitysCreateData, JohtoselvitysUpdateData>({
    onCreateSuccess({ id }) {
      setValue('id', id);
      reset({}, { keepValues: true });
    },
    onUpdateSuccess({
      applicationData: {
        customerWithContacts,
        contractorWithContacts,
        propertyDeveloperWithContacts,
        representativeWithContacts,
      },
    }) {
      if (customerWithContacts !== null) {
        setValue(
          'applicationData.customerWithContacts.customer.yhteystietoId',
          customerWithContacts.customer.yhteystietoId,
        );
      }
      if (contractorWithContacts !== null) {
        setValue(
          'applicationData.contractorWithContacts.customer.yhteystietoId',
          contractorWithContacts.customer.yhteystietoId,
        );
      }
      if (propertyDeveloperWithContacts !== null) {
        setValue(
          'applicationData.propertyDeveloperWithContacts.customer.yhteystietoId',
          propertyDeveloperWithContacts.customer.yhteystietoId,
        );
      }
      if (representativeWithContacts !== null) {
        setValue(
          'applicationData.representativeWithContacts.customer.yhteystietoId',
          representativeWithContacts.customer.yhteystietoId,
        );
      }
      reset({}, { keepValues: true });
    },
  });

  const applicationSendMutation = useSendApplication({
    onSuccess(data) {
      navigateToApplicationView(data.id?.toString());
    },
  });

  async function onSendApplication(pdr: PaperDecisionReceiver | undefined | null) {
    const data = getValues();
    applicationSendMutation.mutate({
      id: data.id as number,
      paperDecisionReceiver: pdr,
    });
    setIsSendButtonDisabled(true);
    setShowSendDialog(false);
  }

  function openSendDialog() {
    setShowSendDialog(true);
  }

  function closeSendDialog() {
    setShowSendDialog(false);
  }

  function saveCableApplication(handleSuccess?: (data: Application<JohtoselvitysData>) => void) {
    const formData = getValues();
    if (!formData.id) {
      applicationCreateMutation.mutate(
        {
          applicationType: formData.applicationType,
          hankeTunnus: hanke!.hankeTunnus,
          name: formData.applicationData.name,
          postalAddress: formData.applicationData.postalAddress,
          workDescription: formData.applicationData.workDescription,
          constructionWork: formData.applicationData.constructionWork,
          maintenanceWork: formData.applicationData.maintenanceWork,
          emergencyWork: formData.applicationData.emergencyWork,
          propertyConnectivity: formData.applicationData.propertyConnectivity,
          rockExcavation: formData.applicationData.rockExcavation,
        },
        { onSuccess: handleSuccess },
      );
    } else {
      applicationUpdateMutation.mutate(
        { id: formData.id, data: convertFormStateToJohtoselvitysUpdateData(formData) },
        { onSuccess: handleSuccess },
      );
    }
  }

  function handleStepChange() {
    // Save application when page is changed
    // only if something has changed
    if (isDirty) {
      saveCableApplication();
    }
  }

  function saveAndQuit() {
    function handleSuccess(data: Application<JohtoselvitysData>) {
      navigateToApplicationView(data.id?.toString());
      setNotification(true, {
        position: 'top-right',
        dismissible: true,
        autoClose: true,
        autoCloseDuration: 5000,
        label: t('hakemus:notifications:saveSuccessLabel'),
        message: t('hakemus:notifications:saveSuccessText'),
        type: 'success',
        closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
      });
    }
    saveCableApplication(handleSuccess);
  }

  function handleAttachmentUpload(isUploading: boolean) {
    setAttachmentsUploading(isUploading);
  }

  function closeAttachmentUploadErrorDialog() {
    setAttachmentUploadErrors([]);
  }

  // Fields that are validated in each page when moving forward in form
  const pageFieldsToValidate: FieldPath<JohtoselvitysFormValues>[][] = useMemo(
    () => [
      // Basic information page
      [
        'applicationData.name',
        'applicationData.postalAddress.streetAddress.streetName',
        'applicationData.constructionWork',
        'applicationData.rockExcavation',
        'applicationData.workDescription',
      ],
      // Areas page
      [
        'applicationData.startTime',
        'applicationData.endTime',
        'applicationData.areas',
        'selfIntersectingPolygon',
      ],
      // Contacts page
      [
        'applicationData.customerWithContacts',
        'applicationData.contractorWithContacts',
        'applicationData.propertyDeveloperWithContacts',
        'applicationData.representativeWithContacts',
      ],
    ],
    [],
  );

  const formSteps = useMemo(() => {
    const formValues = getValues();

    return [
      {
        element: <BasicInfo />,
        label: t('form:headers:perustiedot'),
        state: StepState.available,
      },
      {
        element: <Geometries hankeData={hanke} />,
        label: t('form:headers:alueet'),
        /*
         * Determine initial state for the form step.
         * If all the fields in the previous page are valid, step is available,
         * otherwise it's disabled.
         */
        state: isPageValid<JohtoselvitysFormValues>(
          validationSchema,
          pageFieldsToValidate[0],
          formValues,
        )
          ? StepState.available
          : StepState.disabled,
      },
      {
        element: <Contacts hankeTunnus={hanke?.hankeTunnus ?? null} />,
        label: t('form:headers:yhteystiedot'),
        state: isPageValid<JohtoselvitysFormValues>(
          validationSchema,
          pageFieldsToValidate[1],
          formValues,
        )
          ? StepState.available
          : StepState.disabled,
      },
      {
        element: (
          <Attachments
            existingAttachments={existingAttachments}
            attachmentsLoadError={attachmentsLoadError}
            onFileUpload={handleAttachmentUpload}
          />
        ),
        label: t('hankePortfolio:tabit:liitteet'),
        state: isPageValid<JohtoselvitysFormValues>(
          validationSchema,
          pageFieldsToValidate[2],
          formValues,
        )
          ? StepState.available
          : StepState.disabled,
      },
      {
        element: <ReviewAndSend attachments={existingAttachments} />,
        label: t('form:headers:yhteenveto'),
        state: isPageValid<JohtoselvitysFormValues>(
          validationSchema,
          pageFieldsToValidate[2],
          formValues,
        )
          ? StepState.available
          : StepState.disabled,
      },
    ];
  }, [t, getValues, pageFieldsToValidate, hanke, existingAttachments, attachmentsLoadError]);

  const hankeNameText = (
    <div style={{ visibility: hanke !== undefined ? 'visible' : 'hidden' }}>
      {`${hanke?.nimi} (${hanke?.hankeTunnus})`}
    </div>
  );

  function validateStepChange(changeStep: () => void, stepIndex: number) {
    return changeFormStep(changeStep, pageFieldsToValidate[stepIndex], trigger);
  }

  const attachmentsUploadingText: string = t('common:components:fileUpload:loadingText');

  return (
    <FormProvider {...formContext}>
      {/* Notifications for saving application */}
      {showSaveNotification === 'create' && (
        <ApplicationSaveNotification
          saveSuccess={applicationCreateMutation.isSuccess}
          onClose={() => setShowSaveNotification(null)}
        />
      )}
      {showSaveNotification === 'update' && (
        <ApplicationSaveNotification
          saveSuccess={applicationUpdateMutation.isSuccess}
          onClose={() => setShowSaveNotification(null)}
        />
      )}

      <MultipageForm
        heading={t('johtoselvitysForm:pageHeader')}
        subHeading={hankeNameText}
        formSteps={formSteps}
        isLoading={attachmentsUploading}
        isLoadingText={attachmentsUploadingText}
        onStepChange={handleStepChange}
        onSubmit={handleSubmit(openSendDialog)}
        stepChangeValidator={validateStepChange}
      >
        {function renderFormActions(activeStepIndex, handlePrevious, handleNext) {
          async function handleSaveAndQuit() {
            // Make sure that current application page is valid before saving and quitting
            const applicationPageValid = await trigger(pageFieldsToValidate[activeStepIndex], {
              shouldFocus: true,
            });
            if (applicationPageValid) {
              saveAndQuit();
            }
          }

          const lastStep = activeStepIndex === formSteps.length - 1;
          const isDraft = isApplicationDraft(getValues('alluStatus') as AlluStatus | null);
          const isContact = isContactIn(signedInUser, getValues('applicationData'));
          const showSendButton = lastStep && isDraft;
          const disableSendButton = showSendButton && !isContact;

          const saveAndQuitIsLoading =
            applicationCreateMutation.isLoading ||
            applicationUpdateMutation.isLoading ||
            attachmentsUploading;
          const saveAndQuitLoadingText = attachmentsUploading
            ? attachmentsUploadingText
            : t('common:buttons:savingText');
          return (
            <FormActions
              activeStepIndex={activeStepIndex}
              totalSteps={formSteps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              previousButtonIsLoading={attachmentsUploading}
              previousButtonLoadingText={attachmentsUploadingText}
              nextButtonIsLoading={attachmentsUploading}
              nextButtonLoadingText={attachmentsUploadingText}
            >
              <ApplicationCancel
                applicationId={getValues('id')}
                alluStatus={getValues('alluStatus')}
                hankeTunnus={hanke?.hankeTunnus}
                buttonIcon={<IconCross aria-hidden />}
                saveAndQuitIsLoading={saveAndQuitIsLoading}
                saveAndQuitIsLoadingText={saveAndQuitLoadingText}
              />

              <Button
                variant="secondary"
                iconLeft={<IconSaveDiskette aria-hidden="true" />}
                data-testid="save-form-btn"
                onClick={handleSaveAndQuit}
                isLoading={saveAndQuitIsLoading}
                loadingText={saveAndQuitLoadingText}
              >
                {t('hankeForm:saveDraftButton')}
              </Button>
              {showSendButton && (
                <Button
                  type="submit"
                  iconLeft={<IconEnvelope aria-hidden="true" />}
                  loadingText={t('common:buttons:sendingText')}
                  disabled={disableSendButton || isSendButtonDisabled}
                >
                  {t('hakemus:buttons:sendApplication')}
                </Button>
              )}
              {disableSendButton && (
                <Notification
                  size="small"
                  style={{ marginTop: 'var(--spacing-xs)' }}
                  type="info"
                  label={t('hakemus:notifications:sendApplicationDisabled')}
                >
                  {t('hakemus:notifications:sendApplicationDisabled')}
                </Notification>
              )}
            </FormActions>
          );
        }}
      </MultipageForm>

      {/* Attachment upload error dialog */}
      <ConfirmationDialog
        title={t('form:errors:fileLoadError')}
        description={attachmentUploadErrors}
        showSecondaryButton={false}
        showCloseButton
        isOpen={attachmentUploadErrors.length > 0}
        close={closeAttachmentUploadErrorDialog}
        mainAction={closeAttachmentUploadErrorDialog}
        mainBtnLabel={t('common:ariaLabels:closeButtonLabelText')}
        variant="primary"
      />

      <ApplicationSendDialog
        type="CABLE_REPORT"
        isOpen={showSendDialog}
        isLoading={applicationSendMutation.isLoading}
        onClose={closeSendDialog}
        onSend={onSendApplication}
      />
    </FormProvider>
  );
};

export default JohtoselvitysContainer;
