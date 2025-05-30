import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldPath, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  ButtonVariant,
  IconEnvelope,
  IconQuestionCircle,
  IconSaveDiskette,
  Link,
  Notification,
  NotificationSize,
  StepState,
} from 'hds-react';
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
import { convertFormStateToKaivuilmoitusUpdateData } from '../kaivuilmoitus/utils';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';
import useNavigateToApplicationView from '../application/hooks/useNavigateToApplicationView';
import { changeFormStep } from '../forms/utils';
import ApplicationSaveNotification from '../application/components/ApplicationSaveNotification';
import TaydennysCancel from '../application/taydennys/components/TaydennysCancel';
import useAttachments from '../application/hooks/useAttachments';
import ReviewAndSend from './ReviewAndSend';
import { getJohtoselvitysIdentifiers, isContactIn } from '../application/utils';
import useSendTaydennys from '../application/taydennys/hooks/useSendTaydennys';
import { usePermissionsForHanke } from '../hanke/hankeUsers/hooks/useUserRightsForHanke';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import FormErrorsNotification from '../kaivuilmoitus/components/FormErrorsNotification';
import { updateTaydennys } from '../application/taydennys/taydennysApi';
import useUpdateHakemus from '../application/taydennysAndMuutosilmoitusCommon/hooks/useUpdateHakemus';
import useTaydennysSendNotification from '../application/taydennys/hooks/useTaydennysSendNotification';
import Attachments from '../application/taydennysAndMuutosilmoitusCommon/components/Attachments';
import {
  deleteAttachment,
  downloadAttachment,
  uploadAttachment,
} from '../application/taydennys/taydennysAttachmentsApi';
import Button from '../../common/components/button/Button';

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
  const { setNotification } = useGlobalNotification();
  const navigateToApplicationView = useNavigateToApplicationView();
  const { data: hankkeenHakemukset } = useApplicationsForHanke(hankeData.hankeTunnus, true);
  const johtoselvitysIds = getJohtoselvitysIdentifiers(hankkeenHakemukset?.applications);
  const sendTaydennysMutation = useSendTaydennys();
  const { showSendSuccess } = useTaydennysSendNotification();
  const [showSendDialog, setShowSendDialog] = useState(false);
  const { data: signedInUser } = usePermissionsForHanke(hankeData.hankeTunnus);
  const { data: originalAttachments } = useAttachments(originalApplication.id);

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

  const { hakemusUpdateMutation, showSaveNotification, setShowSaveNotification } = useUpdateHakemus<
    KaivuilmoitusData,
    KaivuilmoitusUpdateData
  >(
    originalApplication.id,
    updateTaydennys,
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
          attachments={taydennys.liitteet}
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
    hakemusUpdateMutation.mutate(
      { id: formData.id, data: convertFormStateToKaivuilmoitusUpdateData(formData) },
      {
        onSuccess: handleSuccess,
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
    if (!sendTaydennysMutation.isLoading) {
      sendTaydennysMutation.reset();
      setShowSendDialog(false);
    }
  }

  function sendTaydennys() {
    sendTaydennysMutation.mutate(taydennys.id, {
      onSuccess(data) {
        showSendSuccess();
        closeSendDialog();
        navigateToApplicationView(data.id?.toString());
      },
    });
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

          const isContact = isContactIn(signedInUser, getValues('applicationData'));

          const saveAndQuitIsLoading = hakemusUpdateMutation.isLoading;
          const saveAndQuiteButtonIcon = <IconSaveDiskette />;
          const saveAndQuitButtonText = t('hankeForm:saveDraftButton');

          const showSendButton =
            lastStep &&
            isValid &&
            (taydennys.muutokset.length > 0 || taydennys.liitteet.length > 0);
          const sendIsLoading = sendTaydennysMutation.isLoading;
          const sendButtonIcon = <IconEnvelope />;
          const disableSendButton = showSendButton && !isContact;

          return (
            <FormActions
              activeStepIndex={activeStep}
              totalSteps={formSteps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
            >
              <TaydennysCancel
                application={originalApplication}
                navigateToApplicationViewOnSuccess
                buttonVariant={ButtonVariant.Danger}
                buttonIsLoading={saveAndQuitIsLoading}
                buttonIsLoadingText={saveAndQuitButtonText}
              />
              <Button
                variant={ButtonVariant.Secondary}
                onClick={handleSaveAndQuit}
                iconStart={saveAndQuiteButtonIcon}
                isLoading={saveAndQuitIsLoading}
                loadingText={t('common:buttons:savingText')}
              >
                {saveAndQuitButtonText}
              </Button>
              {showSendButton && (
                <Button
                  type="submit"
                  loadingText={t('common:buttons:sendingText')}
                  isLoading={sendIsLoading}
                  iconStart={sendButtonIcon}
                  disabled={disableSendButton}
                >
                  {t('taydennys:buttons:sendTaydennys')}
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

      <ConfirmationDialog
        title={t('taydennys:sendDialog:title')}
        description={
          sendTaydennysMutation.isError ? (
            <>
              {t('taydennys:sendDialog:description')}
              <Box paddingTop="var(--spacing-s)">
                <Notification
                  type="error"
                  size={NotificationSize.Small}
                  label={t('taydennys:notifications:sendErrorLabel')}
                >
                  <Trans i18nKey="taydennys:notifications:sendErrorText">
                    <p>
                      Lähettämisessä tapahtui virhe. Yritä myöhemmin uudelleen tai ota yhteyttä
                      Haitattoman tekniseen tukeen sähköpostiosoitteessa
                      <Link href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</Link>.
                    </p>
                  </Trans>
                </Notification>
              </Box>
            </>
          ) : (
            t('taydennys:sendDialog:description')
          )
        }
        showCloseButton
        isOpen={showSendDialog}
        close={closeSendDialog}
        mainAction={sendTaydennys}
        variant="primary"
        isLoading={sendTaydennysMutation.isLoading}
        loadingText={t('common:buttons:sendingText')}
        headerIcon={<IconQuestionCircle />}
        disabled={sendTaydennysMutation.isLoading}
      />
    </FormProvider>
  );
}
