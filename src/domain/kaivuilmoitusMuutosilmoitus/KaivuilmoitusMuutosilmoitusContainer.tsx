import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldPath, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonVariant,
  IconEnvelope,
  IconSaveDiskette,
  Notification,
  NotificationSize,
  StepState,
} from 'hds-react';
import { Muutosilmoitus } from '../application/muutosilmoitus/types';
import {
  Application,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
} from '../application/types/application';
import { HankeData } from '../types/hanke';
import { convertMuutosilmoitusDataToFormState } from './utils';
import { updateMuutosilmoitus } from '../application/muutosilmoitus/muutosilmoitusApi';
import BasicInfo from '../kaivuilmoitus/BasicInfo';
import {
  alueetSchema,
  haittojenhallintaSuunnitelmaSchema,
  perustiedotSchema,
  yhteystiedotSchema,
} from '../kaivuilmoitus/validationSchema';
import { useApplicationsForHanke } from '../application/hooks/useApplications';
import Areas from '../kaivuilmoitus/Areas';
import HaittojenHallinta from '../kaivuilmoitus/HaittojenHallinta';
import Contacts from '../kaivuilmoitus/Contacts';
import { convertFormStateToKaivuilmoitusUpdateData } from '../kaivuilmoitus/utils';
import MultipageForm from '../forms/MultipageForm';
import { changeFormStep } from '../forms/utils';
import FormActions from '../forms/components/FormActions';
import ApplicationSaveNotification from '../application/components/ApplicationSaveNotification';
import useUpdateHakemus from '../application/taydennysAndMuutosilmoitusCommon/hooks/useUpdateHakemus';
import { getJohtoselvitysIdentifiers, isContactIn } from '../application/utils';
import { KaivuilmoitusMuutosilmoitusFormValues } from './types';
import { validationSchema } from './validationSchema';
import ReviewAndSend from './ReviewAndSend';
import useAttachments from '../application/hooks/useAttachments';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';
import useNavigateToApplicationView from '../application/hooks/useNavigateToApplicationView';
import FormErrorsNotification from '../kaivuilmoitus/components/FormErrorsNotification';
import MuutosilmoitusCancel from '../application/muutosilmoitus/components/MuutosilmoitusCancel';
import { usePermissionsForHanke } from '../hanke/hankeUsers/hooks/useUserRightsForHanke';
import ApplicationSendDialog from '../application/components/ApplicationSendDialog';
import Attachments from '../application/taydennysAndMuutosilmoitusCommon/components/Attachments';
import {
  uploadAttachment,
  deleteAttachment,
  downloadAttachment,
} from '../application/muutosilmoitus/muutosilmoitusAttachmentsApi';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';

type Props = {
  muutosilmoitus: Muutosilmoitus<KaivuilmoitusData>;
  originalApplication: Application<KaivuilmoitusData>;
  hankeData: HankeData;
};

export default function KaivuilmoitusMuutosilmoitusContainer({
  muutosilmoitus,
  originalApplication,
  hankeData,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();
  const navigateToApplicationView = useNavigateToApplicationView();
  const { data: hankkeenHakemukset } = useApplicationsForHanke(hankeData.hankeTunnus, true);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const { data: signedInUser } = usePermissionsForHanke(hankeData.hankeTunnus);
  const johtoselvitysIds = getJohtoselvitysIdentifiers(hankkeenHakemukset?.applications);
  const { data: originalAttachments } = useAttachments(originalApplication.id);

  const formContext = useForm<KaivuilmoitusMuutosilmoitusFormValues>({
    mode: 'onTouched',
    defaultValues: convertMuutosilmoitusDataToFormState(muutosilmoitus),
    resolver: yupResolver(validationSchema),
    context: { application: muutosilmoitus },
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

  const { hakemusUpdateMutation, showSaveNotification, setShowSaveNotification } = useUpdateHakemus<
    KaivuilmoitusData,
    KaivuilmoitusUpdateData
  >(
    originalApplication.id,
    updateMuutosilmoitus,
    function onUpdateSuccess({ applicationData: { customerWithContacts, invoicingCustomer } }) {
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
    },
  );

  // Fields that are validated in each page when moving in the form
  // If validation of a field fails, the form will not move to the next page
  const pageFieldsToValidate: FieldPath<KaivuilmoitusMuutosilmoitusFormValues>[][] = [
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
        <Areas
          hankeData={hankeData}
          hankkeenHakemukset={hankkeenHakemukset?.applications ?? []}
          originalHakemus={originalApplication}
        />
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
          attachments={muutosilmoitus.liitteet}
          originalAttachments={originalAttachments}
          api={{
            uploadAttachment: uploadAttachment,
            deleteAttachment: deleteAttachment,
            downloadAttachment: downloadAttachment,
          }}
        />
      ),
      label: t('hankePortfolio:tabit:liitteet'),
      state: StepState.available,
    },
    {
      element: (
        <ReviewAndSend
          muutosilmoitus={muutosilmoitus}
          originalApplication={originalApplication}
          originalAttachments={originalAttachments ?? []}
          hankealueet={hankeData.alueet}
        />
      ),
      label: t('form:headers:yhteenveto'),
      state: StepState.available,
    },
  ];

  function saveMuutosilmoitus(handleSuccess?: () => void) {
    const formData = getValues();
    hakemusUpdateMutation.mutate(
      { id: formData.id, data: convertFormStateToKaivuilmoitusUpdateData(formData) },
      {
        onSuccess: handleSuccess,
      },
    );
  }

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const lastStep = activeStepIndex === formSteps.length - 1;

  function handleStepChange(stepIndex: number) {
    setActiveStepIndex(stepIndex);
    // Save application when page is changed
    // only if something has changed
    if (isDirty) {
      saveMuutosilmoitus();
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
    saveMuutosilmoitus(handleSuccess);
  }

  function openSendDialog() {
    setShowSendDialog(true);
  }

  function closeSendDialog(id?: number | null) {
    setShowSendDialog(false);
    navigateToApplicationView(id?.toString());
  }

  function validateStepChange(changeStep: () => void, stepIndex: number) {
    return changeFormStep(changeStep, pageFieldsToValidate[stepIndex] || [], trigger);
  }

  return (
    <FormProvider {...formContext}>
      <MultipageForm
        heading={t('muutosilmoitus:heading')}
        subHeading={`${originalApplication.applicationData.name} (${originalApplication.applicationIdentifier})`}
        formSteps={formSteps}
        formData={watchFormValues}
        validationContext={{ application: watchFormValues }}
        onStepChange={handleStepChange}
        stepChangeValidator={validateStepChange}
        topElement={
          <FormErrorsNotification
            data={watchFormValues}
            validationContext={{ application: watchFormValues }}
            activeStepIndex={activeStepIndex}
            lastStep={lastStep}
          />
        }
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

          const saveAndQuitIsLoading = hakemusUpdateMutation.isLoading;
          const saveAndQuitLoadingText = t('common:buttons:savingText');
          const saveButtonIcon = saveAndQuitIsLoading ? (
            <LoadingSpinner small />
          ) : (
            <IconSaveDiskette />
          );

          const isContact = isContactIn(signedInUser, getValues('applicationData'));
          const showSendButton =
            lastStep &&
            isValid &&
            (muutosilmoitus.muutokset.length > 0 || muutosilmoitus.liitteet.length > 0);
          const disableSendButton = showSendButton && !isContact;

          return (
            <FormActions
              activeStepIndex={activeStep}
              totalSteps={formSteps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
            >
              <MuutosilmoitusCancel
                application={originalApplication}
                navigateToApplicationViewOnSuccess
                buttonVariant={ButtonVariant.Danger}
                buttonIsLoading={saveAndQuitIsLoading}
                buttonIsLoadingText={saveAndQuitLoadingText}
              />
              <Button
                variant={ButtonVariant.Secondary}
                onClick={handleSaveAndQuit}
                iconStart={saveButtonIcon}
                disabled={saveAndQuitIsLoading}
              >
                {saveAndQuitIsLoading ? saveAndQuitLoadingText : t('hankeForm:saveDraftButton')}
              </Button>
              {showSendButton && (
                <Button type="submit" iconStart={<IconEnvelope />} disabled={disableSendButton}>
                  {t('muutosilmoitus:buttons:sendMuutosilmoitus')}
                </Button>
              )}
              {disableSendButton && (
                <Notification
                  size={NotificationSize.Small}
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
          saveSuccess={hakemusUpdateMutation.isSuccess}
          onClose={() => setShowSaveNotification(false)}
        />
      )}

      <ApplicationSendDialog
        application={originalApplication}
        muutosilmoitus={getValues()}
        isOpen={showSendDialog}
        onClose={closeSendDialog}
      />
    </FormProvider>
  );
}
