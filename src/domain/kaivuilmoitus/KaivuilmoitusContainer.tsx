import React, { useState } from 'react';
import { FieldPath, FormProvider, useForm } from 'react-hook-form';
import { merge } from 'lodash';
import {
  Button,
  IconCross,
  IconEnvelope,
  IconSaveDiskette,
  Notification,
  StepState,
} from 'hds-react';
import { yupResolver } from '@hookform/resolvers/yup';
import MultipageForm from '../forms/MultipageForm';
import BasicInfo from './BasicInfo';
import Contacts from './Contacts';
import Attachments from './Attachments';
import ReviewAndSend from './ReviewAndSend';
import { HankeData } from '../types/hanke';
import { useTranslation } from 'react-i18next';
import FormActions from '../forms/components/FormActions';
import { ApplicationCancel } from '../application/components/ApplicationCancel';
import { KaivuilmoitusFormValues } from './types';
import {
  validationSchema,
  perustiedotSchema,
  yhteystiedotSchema,
  liitteetSchema,
  alueetSchema,
} from './validationSchema';
import { useApplicationsForHanke } from '../application/hooks/useApplications';
import {
  AlluStatus,
  Application,
  KaivuilmoitusCreateData,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
  PaperDecisionReceiver,
} from '../application/types/application';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';
import {
  convertApplicationDataToFormState,
  convertFormStateToKaivuilmoitusUpdateData,
} from './utils';
import ApplicationSaveNotification from '../application/components/ApplicationSaveNotification';
import useSaveApplication from '../application/hooks/useSaveApplication';
import useAttachments from '../application/hooks/useAttachments';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { changeFormStep } from '../forms/utils';
import Areas from './Areas';
import useNavigateToApplicationView from '../application/hooks/useNavigateToApplicationView';
import { isApplicationDraft, isContactIn } from '../application/utils';
import { usePermissionsForHanke } from '../hanke/hankeUsers/hooks/useUserRightsForHanke';
import useSendApplication from '../application/hooks/useSendApplication';
import ApplicationSendDialog from '../application/components/ApplicationSendDialog';

type Props = {
  hankeData: HankeData;
  application?: Application<KaivuilmoitusData>;
};

export default function KaivuilmoitusContainer({ hankeData, application }: Readonly<Props>) {
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();
  const navigateToApplicationView = useNavigateToApplicationView();
  const [attachmentUploadErrors, setAttachmentUploadErrors] = useState<JSX.Element[]>([]);
  const { data: hankkeenHakemukset } = useApplicationsForHanke(hankeData.hankeTunnus);
  const { data: signedInUser } = usePermissionsForHanke(hankeData.hankeTunnus);
  const johtoselvitysIds = hankkeenHakemukset?.applications
    .filter(
      (hakemus) =>
        hakemus.applicationType === 'CABLE_REPORT' && Boolean(hakemus.applicationIdentifier),
    )
    .map((hakemus) => hakemus.applicationIdentifier!);

  const initialValues: KaivuilmoitusFormValues = {
    id: null,
    alluStatus: null,
    applicationType: 'EXCAVATION_NOTIFICATION',
    hankeTunnus: hankeData.hankeTunnus,
    applicationData: {
      applicationType: 'EXCAVATION_NOTIFICATION',
      name: '',
      workDescription: '',
      constructionWork: false,
      maintenanceWork: false,
      emergencyWork: false,
      rockExcavation: false,
      cableReportDone: false,
      cableReports: [],
      placementContracts: [],
      requiredCompetence: false,
      areas: [],
      startTime: null,
      endTime: null,
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
    },
  };
  const formContext = useForm<KaivuilmoitusFormValues>({
    mode: 'onTouched',
    defaultValues: merge(initialValues, convertApplicationDataToFormState(application)),
    resolver: yupResolver(validationSchema),
  });
  const {
    getValues,
    setValue,
    trigger,
    watch,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = formContext;
  const watchFormValues = watch();

  const { data: existingAttachments, isError: attachmentsLoadError } = useAttachments(
    getValues('id'),
  );

  const [attachmentsUploading, setAttachmentsUploading] = useState(false);

  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);

  const {
    applicationCreateMutation,
    applicationUpdateMutation,
    showSaveNotification,
    setShowSaveNotification,
  } = useSaveApplication<KaivuilmoitusData, KaivuilmoitusCreateData, KaivuilmoitusUpdateData>({
    onCreateSuccess({ id }) {
      setValue('id', id);
    },
    onUpdateSuccess({
      applicationData: {
        customerWithContacts,
        contractorWithContacts,
        propertyDeveloperWithContacts,
        representativeWithContacts,
        invoicingCustomer,
      },
    }) {
      if (customerWithContacts) {
        setValue(
          'applicationData.customerWithContacts.customer.yhteystietoId',
          customerWithContacts.customer.yhteystietoId,
        );
        setValue(
          'applicationData.customerWithContacts.customer.registryKey',
          customerWithContacts.customer.registryKey,
        );
        setValue(
          'applicationData.customerWithContacts.customer.registryKeyHidden',
          customerWithContacts.customer.registryKeyHidden,
        );
      }
      if (contractorWithContacts) {
        setValue(
          'applicationData.contractorWithContacts.customer.yhteystietoId',
          contractorWithContacts.customer.yhteystietoId,
        );
      }
      if (propertyDeveloperWithContacts) {
        setValue(
          'applicationData.propertyDeveloperWithContacts.customer.yhteystietoId',
          propertyDeveloperWithContacts.customer.yhteystietoId,
        );
      }
      if (representativeWithContacts) {
        setValue(
          'applicationData.representativeWithContacts.customer.yhteystietoId',
          representativeWithContacts.customer.yhteystietoId,
        );
      }
      if (invoicingCustomer) {
        setValue('applicationData.invoicingCustomer.registryKey', invoicingCustomer.registryKey);
        setValue(
          'applicationData.invoicingCustomer.registryKeyHidden',
          invoicingCustomer.registryKeyHidden,
        );
      }
    },
  });

  function saveApplication(handleSuccess?: (data: Application<KaivuilmoitusData>) => void) {
    const formData = getValues();
    if (!formData.id) {
      applicationCreateMutation.mutate(
        {
          applicationType: formData.applicationType,
          hankeTunnus: hankeData.hankeTunnus,
          name: formData.applicationData.name,
          workDescription: formData.applicationData.workDescription,
          constructionWork: formData.applicationData.constructionWork,
          maintenanceWork: formData.applicationData.maintenanceWork,
          emergencyWork: formData.applicationData.emergencyWork,
          rockExcavation: formData.applicationData.rockExcavation,
          cableReportDone: formData.applicationData.cableReportDone,
          cableReports: formData.applicationData.cableReports,
          placementContracts: formData.applicationData.placementContracts,
          requiredCompetence: formData.applicationData.requiredCompetence,
        },
        { onSuccess: handleSuccess },
      );
    } else {
      applicationUpdateMutation.mutate(
        { id: formData.id, data: convertFormStateToKaivuilmoitusUpdateData(formData) },
        { onSuccess: handleSuccess },
      );
    }
  }

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

  function handleStepChange() {
    if (isDirty) {
      saveApplication();
    }
  }

  function saveAndQuit() {
    function handleSuccess(data: Application<KaivuilmoitusData>) {
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
    saveApplication(handleSuccess);
  }

  function handleAttachmentUpload(isUploading: boolean) {
    setAttachmentsUploading(isUploading);
  }

  function closeAttachmentUploadErrorDialog() {
    setAttachmentUploadErrors([]);
  }

  const pageFieldsToValidate: FieldPath<KaivuilmoitusFormValues>[][] = [
    // Basic information page
    ['applicationData.name'],
    // Areas page
    ['selfIntersectingPolygon'],
    // Contacts page
    [
      'applicationData.customerWithContacts.customer.registryKey',
      'applicationData.contractorWithContacts.customer.registryKey',
      'applicationData.propertyDeveloperWithContacts.customer.registryKey',
      'applicationData.representativeWithContacts.customer.registryKey',
      'applicationData.invoicingCustomer.registryKey',
      'applicationData.invoicingCustomer.ovt',
    ],
  ];

  const formSteps = [
    {
      element: <BasicInfo johtoselvitysIds={johtoselvitysIds} />,
      label: t('form:headers:perustiedot'),
      state: StepState.available,
      validationSchema: perustiedotSchema,
    },
    {
      element: (
        <Areas hankeData={hankeData} hankkeenHakemukset={hankkeenHakemukset?.applications ?? []} />
      ),
      label: t('form:headers:alueet'),
      state: StepState.available,
      validationSchema: alueetSchema,
    },
    {
      element: <Contacts hankeTunnus={hankeData.hankeTunnus} />,
      label: t('form:headers:yhteystiedot'),
      state: StepState.available,
      validationSchema: yhteystiedotSchema,
    },
    {
      element: (
        <Attachments
          existingAttachments={existingAttachments}
          attachmentsLoadError={attachmentsLoadError}
          onFileUpload={handleAttachmentUpload}
        />
      ),
      label: t('form:headers:liitteetJaLisatiedot'),
      state: StepState.available,
      validationSchema: liitteetSchema,
    },
    {
      element: <ReviewAndSend attachments={existingAttachments} />,
      label: t('form:headers:yhteenveto'),
      state: StepState.available,
    },
  ];

  const attachmentsUploadingText: string = t('common:components:fileUpload:loadingText');

  function validateStepChange(changeStep: () => void, stepIndex: number) {
    return changeFormStep(changeStep, pageFieldsToValidate[stepIndex] || [], trigger, errors, [
      'required',
    ]);
  }

  return (
    <FormProvider {...formContext}>
      <MultipageForm
        heading={t('kaivuilmoitusForm:pageHeader')}
        subHeading={`${hankeData.nimi} (${hankeData.hankeTunnus})`}
        formSteps={formSteps}
        formData={watchFormValues}
        onStepChange={handleStepChange}
        isLoading={attachmentsUploading}
        isLoadingText={attachmentsUploadingText}
        stepChangeValidator={validateStepChange}
        onSubmit={handleSubmit(openSendDialog)}
      >
        {function renderFormActions(activeStepIndex, handlePrevious, handleNext) {
          async function handleSaveAndQuit() {
            // Make sure that application name is valid before saving and quitting
            const applicationValid = await trigger('applicationData.name', {
              shouldFocus: true,
            });
            if (applicationValid) {
              saveAndQuit();
            }
          }

          const saveAndQuitIsLoading =
            applicationCreateMutation.isLoading ||
            applicationUpdateMutation.isLoading ||
            attachmentsUploading;
          const saveAndQuitLoadingText = attachmentsUploading
            ? attachmentsUploadingText
            : t('common:buttons:savingText');

          const lastStep = activeStepIndex === formSteps.length - 1;
          const isDraft = isApplicationDraft(getValues('alluStatus') as AlluStatus | null);
          const isContact = isContactIn(signedInUser, getValues('applicationData'));
          const showSendButton = lastStep && isDraft && isValid;
          const disableSendButton = showSendButton && !isContact;

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
                hankeTunnus={hankeData.hankeTunnus}
                buttonIcon={<IconCross />}
                saveAndQuitIsLoading={saveAndQuitIsLoading}
                saveAndQuitIsLoadingText={saveAndQuitLoadingText}
              />

              <Button
                variant="secondary"
                onClick={handleSaveAndQuit}
                iconLeft={<IconSaveDiskette />}
                isLoading={saveAndQuitIsLoading}
                loadingText={saveAndQuitLoadingText}
              >
                {t('hankeForm:saveDraftButton')}
              </Button>

              {showSendButton && (
                <Button
                  type="submit"
                  iconLeft={<IconEnvelope />}
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
        isOpen={showSendDialog}
        isLoading={applicationSendMutation.isLoading}
        onClose={closeSendDialog}
        onSend={onSendApplication}
        applicationId={getValues('id') as number}
      />
    </FormProvider>
  );
}
