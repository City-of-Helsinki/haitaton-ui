import React, { useState } from 'react';
import { FieldPath, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  IconEnvelope,
  IconQuestionCircle,
  IconSaveDiskette,
  Link,
  StepState,
  Notification,
  LoadingSpinner,
} from 'hds-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@chakra-ui/react';
import { ValidationError } from 'yup';
import { Taydennys } from '../application/taydennys/types';
import {
  Application,
  JohtoselvitysData,
  JohtoselvitysUpdateData,
} from '../application/types/application';
import { convertTaydennysDataToFormState } from './utils';
import { JohtoselvitysTaydennysFormValues } from './types';
import MultipageForm from '../forms/MultipageForm';
import { BasicInfo } from '../johtoselvitys/BasicInfo';
import Geometries from '../johtoselvitys/Geometries';
import Contacts from '../application/components/ApplicationContacts';
import { HankeData } from '../types/hanke';
import FormActions from '../forms/components/FormActions';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';
import { validationSchema } from './validationSchema';
import {
  alueetSchema,
  perustiedotSchema,
  yhteystiedotSchema,
} from '../johtoselvitys/validationSchema';
import ReviewAndSend from './ReviewAndSend';
import TaydennyspyyntoNotification from '../application/taydennys/TaydennyspyyntoNotification';
import useNavigateToApplicationView from '../application/hooks/useNavigateToApplicationView';
import { convertFormStateToJohtoselvitysUpdateData } from '../johtoselvitys/utils';
import ApplicationSaveNotification from '../application/components/ApplicationSaveNotification';
import { changeFormStep } from '../forms/utils';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import useSendTaydennys from '../application/taydennys/hooks/useSendTaydennys';
import { useValidationErrors } from '../forms/hooks/useValidationErrors';
import FormPagesErrorSummary from '../forms/components/FormPagesErrorSummary';
import FormFieldsErrorSummary from '../forms/components/FormFieldsErrorSummary';
import { isContactIn } from '../application/utils';
import { usePermissionsForHanke } from '../hanke/hankeUsers/hooks/useUserRightsForHanke';
import TaydennysCancel from '../application/taydennys/components/TaydennysCancel';
import Attachments from './Attachments';
import useAttachments from '../application/hooks/useAttachments';
import { updateTaydennys } from '../application/taydennys/taydennysApi';
import useUpdateHakemus from '../application/taydennysAndMuutosilmoitusCommon/hooks/useUpdateHakemus';
import useTaydennysSendNotification from '../application/taydennys/hooks/useTaydennysSendNotification';

type Props = {
  taydennys: Taydennys<JohtoselvitysData>;
  originalApplication: Application<JohtoselvitysData>;
  hankeData: HankeData;
};

export default function JohtoselvitysTaydennysContainer({
  taydennys,
  originalApplication,
  hankeData,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();
  const navigateToApplicationView = useNavigateToApplicationView();
  const sendTaydennysMutation = useSendTaydennys();
  const { showSendSuccess } = useTaydennysSendNotification();
  const [showSendDialog, setShowSendDialog] = useState(false);
  const { data: signedInUser } = usePermissionsForHanke(hankeData.hankeTunnus);
  const { data: originalAttachments } = useAttachments(originalApplication.id);

  const formContext = useForm<JohtoselvitysTaydennysFormValues>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: convertTaydennysDataToFormState(taydennys),
    resolver: yupResolver(validationSchema),
  });

  const {
    getValues,
    setValue,
    trigger,
    formState: { isDirty, errors, isValid },
    watch,
    handleSubmit,
  } = formContext;
  const watchFormValues = watch();

  const { hakemusUpdateMutation, showSaveNotification, setShowSaveNotification } = useUpdateHakemus<
    JohtoselvitysData,
    JohtoselvitysUpdateData
  >(originalApplication.id, updateTaydennys);

  // Fields that are validated in each page when moving in the form
  const pageFieldsToValidate: FieldPath<JohtoselvitysTaydennysFormValues>[][] = [
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
    ],
    [],
  ];

  const formSteps = [
    {
      element: <BasicInfo />,
      label: t('form:headers:perustiedot'),
      state: StepState.available,
      validationSchema: perustiedotSchema,
    },
    {
      element: <Geometries hankeData={hankeData} />,
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
          applicationId={originalApplication.id!}
          taydennysAttachments={taydennys.liitteet}
          originalAttachments={originalAttachments}
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
        />
      ),
      label: t('form:headers:yhteenveto'),
      state: StepState.available,
    },
  ];

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const perustiedotErrors = useValidationErrors(perustiedotSchema, watchFormValues);
  const alueetErrors = useValidationErrors(alueetSchema, watchFormValues);
  const yhteystiedotErrors = useValidationErrors(yhteystiedotSchema, watchFormValues);
  const formErrorsByPage = [perustiedotErrors, alueetErrors, yhteystiedotErrors, []];

  function mapToErrorListItem(error: ValidationError) {
    const errorPath = error.path?.replace('[', '.').replace(']', '');
    const pathParts = errorPath?.match(/(\w+)/g) || [];

    if (pathParts.length === 1 && pathParts[0] === 'areas') {
      pathParts[0] = 'areas.empty';
    }

    const langKey = pathParts
      .filter((part) => part !== 'applicationData')
      .reduce((acc, part) => {
        return `${acc}:${part}`;
      }, 'hakemus:missingFields');

    return (
      <li key={errorPath}>
        <Link href={`#${errorPath}`} disableVisitedStyles>
          {t(langKey)}
        </Link>
      </li>
    );
  }

  const formErrorsNotification =
    (activeStepIndex === formSteps.length - 1 && (
      <FormPagesErrorSummary
        data={watchFormValues}
        schema={validationSchema}
        notificationLabel={t('hakemus:missingFields:notification:hakemusLabel')}
      />
    )) ||
    (formErrorsByPage[activeStepIndex].length > 0 && (
      <FormFieldsErrorSummary notificationLabel={t('hakemus:missingFields:notification:pageLabel')}>
        {formErrorsByPage[activeStepIndex].map(mapToErrorListItem)}
      </FormFieldsErrorSummary>
    ));

  function saveTaydennys(handleSuccess?: () => void) {
    const formData = getValues();
    hakemusUpdateMutation.mutate(
      { id: formData.id, data: convertFormStateToJohtoselvitysUpdateData(formData) },
      {
        async onSuccess({
          applicationData: {
            customerWithContacts,
            contractorWithContacts,
            propertyDeveloperWithContacts,
            representativeWithContacts,
          },
        }) {
          handleSuccess?.();
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
    return changeFormStep(changeStep, pageFieldsToValidate[stepIndex] || [], trigger, errors, [
      'required',
    ]);
  }

  return (
    <FormProvider {...formContext}>
      <MultipageForm
        heading={t('hakemus:buttons:editApplication')}
        subHeading={`${hankeData.nimi} (${hankeData.hankeTunnus})`}
        formSteps={formSteps}
        formData={watchFormValues}
        topElement={
          <>
            <TaydennyspyyntoNotification
              taydennyspyynto={originalApplication.taydennyspyynto!}
              applicationType="CABLE_REPORT"
            />
            <Box mt="var(--spacing-s)">{formErrorsNotification}</Box>
          </>
        }
        onStepChange={handleStepChange}
        stepChangeValidator={validateStepChange}
        onSubmit={handleSubmit(openSendDialog)}
      >
        {function renderFormActions(activeStep, handlePrevious, handleNext) {
          async function handleSaveAndQuit() {
            // Make sure that current application page is valid before saving and quitting
            const applicationPageValid = await trigger(pageFieldsToValidate[activeStep], {
              shouldFocus: true,
            });
            if (applicationPageValid) {
              saveAndQuit();
            }
          }

          const lastStep = activeStep === formSteps.length - 1;
          const showSendButton =
            lastStep &&
            isValid &&
            (taydennys.muutokset.length > 0 || taydennys.liitteet.length > 0);
          const isContact = isContactIn(signedInUser, getValues('applicationData'));
          const disableSendButton = showSendButton && !isContact;

          const saveAndQuitIsLoading = hakemusUpdateMutation.isLoading;
          const saveAndQuiteButtonIcon = saveAndQuitIsLoading ? (
            <LoadingSpinner small />
          ) : (
            <IconSaveDiskette />
          );
          const saveAndQuitButtonText = saveAndQuitIsLoading
            ? t('common:buttons:savingText')
            : t('hankeForm:saveDraftButton');

          const sendIsLoading = sendTaydennysMutation.isLoading;
          const sendButtonIcon = sendIsLoading ? <LoadingSpinner small /> : <IconEnvelope />;
          const sendButtonText = sendIsLoading
            ? t('common:buttons:sendingText')
            : t('taydennys:buttons:sendTaydennys');

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
                buttonVariant="danger"
                buttonIsLoading={saveAndQuitIsLoading}
                buttonIsLoadingText={t('common:buttons:savingText')}
              />
              <Button
                variant="secondary"
                iconLeft={saveAndQuiteButtonIcon}
                data-testid="save-form-btn"
                onClick={handleSaveAndQuit}
              >
                {saveAndQuitButtonText}
              </Button>
              {showSendButton && (
                <Button type="submit" iconLeft={sendButtonIcon} disabled={disableSendButton}>
                  {sendButtonText}
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
                  size="small"
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
