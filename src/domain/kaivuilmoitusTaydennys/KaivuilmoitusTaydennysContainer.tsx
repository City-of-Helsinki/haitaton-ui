import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldPath, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  IconEnvelope,
  IconQuestionCircle,
  IconSaveDiskette,
  Notification,
  StepState,
} from 'hds-react';
import { useQueryClient } from 'react-query';
import { Box } from '@chakra-ui/layout';
import { KaivuilmoitusTaydennysFormValues } from './types';
import { validationSchema } from './validationSchema';
import { convertTaydennysDataToFormState } from './utils';
import { Taydennys } from '../application/taydennys/types';
import {
  Application,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
} from '../application/types/application';
import { HankeData } from '../types/hanke';
import MultipageForm from '../forms/MultipageForm';
import BasicInfo from '../kaivuilmoitus/BasicInfo';
import {
  perustiedotSchema,
  alueetSchema,
  haittojenhallintaSuunnitelmaSchema,
  yhteystiedotSchema,
} from '../kaivuilmoitus/validationSchema';
import Areas from '../kaivuilmoitus/Areas';
import HaittojenHallinta from '../kaivuilmoitus/HaittojenHallinta';
import Contacts from '../kaivuilmoitus/Contacts';
import { useApplicationsForHanke } from '../application/hooks/useApplications';
import FormActions from '../forms/components/FormActions';
import TaydennyspyyntoNotification from '../application/taydennys/TaydennyspyyntoNotification';
import useUpdateTaydennys from '../application/taydennys/hooks/useUpdateTaydennys';
import { convertFormStateToKaivuilmoitusUpdateData } from '../kaivuilmoitus/utils';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';
import useNavigateToApplicationView from '../application/hooks/useNavigateToApplicationView';
import { changeFormStep } from '../forms/utils';
import ApplicationSaveNotification from '../application/components/ApplicationSaveNotification';
import TaydennysCancel from '../application/taydennys/components/TaydennysCancel';
import Attachments from './Attachments';
import useAttachments from '../application/hooks/useAttachments';
import ReviewAndSend from './ReviewAndSend';
import { isContactIn } from '../application/utils';
import useSendTaydennys from '../application/taydennys/hooks/useSendTaydennys';
import { usePermissionsForHanke } from '../hanke/hankeUsers/hooks/useUserRightsForHanke';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import FormErrorsNotification from '../kaivuilmoitus/components/FormErrorsNotification';

type Props = {
  taydennys: Taydennys<KaivuilmoitusData>;
  originalApplication: Application<KaivuilmoitusData>;
  hankeData: HankeData;
};

export default function KaivuilmoitusTaydennysContainer({
  taydennys,
  originalApplication,
  hankeData,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setNotification } = useGlobalNotification();
  const navigateToApplicationView = useNavigateToApplicationView();
  const { data: hankkeenHakemukset } = useApplicationsForHanke(hankeData.hankeTunnus, true);
  const johtoselvitysIds = hankkeenHakemukset?.applications
    .filter(
      (hakemus) =>
        hakemus.applicationType === 'CABLE_REPORT' && Boolean(hakemus.applicationIdentifier),
    )
    .map((hakemus) => hakemus.applicationIdentifier!);
  const sendTaydennysMutation = useSendTaydennys();
  const [showSendDialog, setShowSendDialog] = useState(false);
  const { data: signedInUser } = usePermissionsForHanke(hankeData.hankeTunnus);
  const { data: originalAttachments } = useAttachments(originalApplication.id);
  const [attachmentsUploading, setAttachmentsUploading] = useState(false);
  const attachmentsUploadingText: string = t('common:components:fileUpload:loadingText');

  const formContext = useForm<KaivuilmoitusTaydennysFormValues>({
    mode: 'onTouched',
    defaultValues: convertTaydennysDataToFormState(taydennys),
    resolver: yupResolver(validationSchema),
    context: { application: taydennys },
  });

  const {
    getValues,
    setValue,
    watch,
    trigger,
    formState: { isDirty, isValid },
    handleSubmit,
  } = formContext;
  const watchFormValues = watch();

  const { taydennysUpdateMutation, showSaveNotification, setShowSaveNotification } =
    useUpdateTaydennys<KaivuilmoitusData, KaivuilmoitusUpdateData>(function onUpdateSuccess({
      applicationData: { customerWithContacts, invoicingCustomer },
    }) {
      if (customerWithContacts) {
        setValue(
          'applicationData.customerWithContacts.customer.registryKey',
          customerWithContacts.customer.registryKey,
        );
        setValue(
          'applicationData.customerWithContacts.customer.registryKeyHidden',
          customerWithContacts.customer.registryKeyHidden,
        );
      }
      if (invoicingCustomer) {
        setValue('applicationData.invoicingCustomer.registryKey', invoicingCustomer.registryKey);
        setValue(
          'applicationData.invoicingCustomer.registryKeyHidden',
          invoicingCustomer.registryKeyHidden,
        );
      }
    });

  function handleAttachmentUpload(isUploading: boolean) {
    setAttachmentsUploading(isUploading);
  }

  // Fields that are validated in each page when moving in the form
  // If validation of a field fails, the form will not move to the next page
  const pageFieldsToValidate: FieldPath<KaivuilmoitusTaydennysFormValues>[][] = [
    // Basic information page
    ['applicationData.name'],
    // Areas page
    ['selfIntersectingPolygon'],
    // Haittojenhallinta page
    [],
    // Contacts page
    [
      'applicationData.customerWithContacts.customer.registryKey',
      'applicationData.contractorWithContacts.customer.registryKey',
      'applicationData.propertyDeveloperWithContacts.customer.registryKey',
      'applicationData.representativeWithContacts.customer.registryKey',
      'applicationData.invoicingCustomer.registryKey',
      'applicationData.invoicingCustomer.ovt',
    ],
    [],
  ];

  const formSteps = [
    {
      element: (
        <BasicInfo
          hankeData={hankeData}
          johtoselvitysIds={johtoselvitysIds}
          hankkeenHakemukset={hankkeenHakemukset?.applications ?? []}
          disableCreateNewJohtoselvitys
        />
      ),
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
      element: <HaittojenHallinta hankeData={hankeData} />,
      label: t('hankeForm:haittojenHallintaForm:header'),
      state: StepState.available,
      validationSchema: haittojenhallintaSuunnitelmaSchema,
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
          applicationId={originalApplication.id!}
          taydennysAttachments={taydennys.liitteet}
          originalAttachments={originalAttachments}
          onFileUpload={handleAttachmentUpload}
        />
      ),
      label: t('hankePortfolio:tabit:liitteet'),
      state: StepState.available,
    },
    {
      element: (
        <ReviewAndSend
          taydennys={taydennys}
          muutokset={taydennys.muutokset}
          originalApplication={originalApplication}
          originalAttachments={originalAttachments ?? []}
          hankealueet={hankeData.alueet}
        />
      ),
      label: t('form:headers:yhteenveto'),
      state: StepState.available,
    },
  ];

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const lastStep = activeStepIndex === formSteps.length - 1;

  function saveTaydennys(handleSuccess?: () => void) {
    const formData = getValues();
    taydennysUpdateMutation.mutate(
      { id: formData.id, data: convertFormStateToKaivuilmoitusUpdateData(formData) },
      {
        async onSuccess() {
          await queryClient.invalidateQueries(['application', originalApplication.id], {
            refetchInactive: true,
          });
          handleSuccess?.();
        },
      },
    );
  }

  function handleStepChange(stepIndex: number) {
    setActiveStepIndex(stepIndex);
    // Save application when page is changed
    // only if something has changed
    if (isDirty) {
      saveTaydennys();
    }
  }

  function saveAndQuit() {
    function handleSuccess() {
      navigateToApplicationView(originalApplication.id?.toString());
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
    saveTaydennys(handleSuccess);
  }

  function openSendDialog() {
    setShowSendDialog(true);
  }

  function closeSendDialog() {
    setShowSendDialog(false);
  }

  function sendTaydennys() {
    sendTaydennysMutation.mutate(taydennys.id, {
      onSuccess(data) {
        navigateToApplicationView(data.id?.toString());
      },
    });
    closeSendDialog();
  }

  function validateStepChange(changeStep: () => void, stepIndex: number) {
    return changeFormStep(changeStep, pageFieldsToValidate[stepIndex] || [], trigger);
  }

  return (
    <FormProvider {...formContext}>
      <MultipageForm
        heading={t('hakemus:buttons:editApplication')}
        subHeading={`${hankeData.nimi} (${hankeData.hankeTunnus})`}
        formSteps={formSteps}
        formData={watchFormValues}
        validationContext={{ application: watchFormValues }}
        topElement={
          <>
            <TaydennyspyyntoNotification
              taydennyspyynto={originalApplication.taydennyspyynto!}
              applicationType="EXCAVATION_NOTIFICATION"
            />
            <Box mt="var(--spacing-s)">
              <FormErrorsNotification
                data={watchFormValues}
                validationContext={{ application: watchFormValues }}
                activeStepIndex={activeStepIndex}
                lastStep={lastStep}
              />
            </Box>
          </>
        }
        isLoading={attachmentsUploading}
        isLoadingText={attachmentsUploadingText}
        onStepChange={handleStepChange}
        stepChangeValidator={validateStepChange}
        onSubmit={handleSubmit(openSendDialog)}
      >
        {function renderFormActions(activeStep, handlePrevious, handleNext) {
          async function handleSaveAndQuit() {
            // Make sure that application name is valid before saving and quitting
            const applicationValid = await trigger('applicationData.name', {
              shouldFocus: true,
            });
            if (applicationValid) {
              saveAndQuit();
            }
          }

          const showSendButton =
            lastStep &&
            isValid &&
            (taydennys.muutokset.length > 0 || taydennys.liitteet.length > 0);
          const isContact = isContactIn(signedInUser, getValues('applicationData'));
          const disableSendButton = showSendButton && !isContact;

          const saveAndQuitIsLoading = taydennysUpdateMutation.isLoading || attachmentsUploading;
          const saveAndQuitLoadingText = attachmentsUploading
            ? attachmentsUploadingText
            : t('common:buttons:savingText');

          return (
            <FormActions
              activeStepIndex={activeStep}
              totalSteps={formSteps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              previousButtonIsLoading={attachmentsUploading}
              previousButtonLoadingText={attachmentsUploadingText}
              nextButtonIsLoading={attachmentsUploading}
              nextButtonLoadingText={attachmentsUploadingText}
            >
              <TaydennysCancel
                application={originalApplication}
                navigateToApplicationViewOnSuccess
                buttonVariant="danger"
                buttonIsLoading={saveAndQuitIsLoading}
                buttonIsLoadingText={saveAndQuitLoadingText}
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
                  iconLeft={<IconEnvelope aria-hidden="true" />}
                  loadingText={t('common:buttons:sendingText')}
                  isLoading={sendTaydennysMutation.isLoading}
                  disabled={disableSendButton}
                >
                  {t('taydennys:buttons:sendTaydennys')}
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

      {showSaveNotification && (
        <ApplicationSaveNotification
          saveSuccess={taydennysUpdateMutation.isSuccess}
          onClose={() => setShowSaveNotification(false)}
        />
      )}

      <ConfirmationDialog
        title={t('taydennys:sendDialog:title')}
        description={t('taydennys:sendDialog:description')}
        showCloseButton
        isOpen={showSendDialog}
        close={closeSendDialog}
        mainAction={sendTaydennys}
        variant="primary"
        headerIcon={<IconQuestionCircle />}
      />
    </FormProvider>
  );
}
