import { useState } from 'react';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from 'react-query';
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
import useUpdateTaydennys from '../application/taydennys/hooks/useUpdateTaydennys';
import { convertFormStateToJohtoselvitysUpdateData } from '../johtoselvitys/utils';
import ApplicationSaveNotification from '../application/components/ApplicationSaveNotification';
import { changeFormStep } from '../forms/utils';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import useSendTaydennys from '../application/taydennys/hooks/useSendTaydennys';
import { isContactIn } from '../application/utils';
import { usePermissionsForHanke } from '../hanke/hankeUsers/hooks/useUserRightsForHanke';
import TaydennysCancel from '../application/taydennys/components/TaydennysCancel';

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
  const queryClient = useQueryClient();
  const { setNotification } = useGlobalNotification();
  const navigateToApplicationView = useNavigateToApplicationView();
  const { taydennysUpdateMutation, showSaveNotification, setShowSaveNotification } =
    useUpdateTaydennys<JohtoselvitysData, JohtoselvitysUpdateData>();
  const sendTaydennysMutation = useSendTaydennys();
  const [showSendDialog, setShowSendDialog] = useState(false);
  const { data: signedInUser } = usePermissionsForHanke(hankeData.hankeTunnus);

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
        <ReviewAndSend
          taydennys={getValues()}
          muutokset={taydennys.muutokset}
          originalApplication={originalApplication}
        />
      ),
      label: t('form:headers:yhteenveto'),
      state: StepState.available,
    },
  ];

  function saveTaydennys(handleSuccess?: () => void) {
    const formData = getValues();
    taydennysUpdateMutation.mutate(
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
          await queryClient.invalidateQueries(['application', originalApplication.id], {
            refetchInactive: true,
          });
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

  function handleStepChange() {
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
        formErrorsNotification={
          <TaydennyspyyntoNotification taydennyspyynto={originalApplication.taydennyspyynto!} />
        }
        onStepChange={handleStepChange}
        stepChangeValidator={validateStepChange}
        onSubmit={handleSubmit(openSendDialog)}
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
          const showSendButton = lastStep && taydennys.muutokset.length > 0 && isValid;
          const isContact = isContactIn(signedInUser, getValues('applicationData'));
          const disableSendButton = showSendButton && !isContact;

          const saveAndQuitIsLoading = taydennysUpdateMutation.isLoading;
          const saveAndQuitLoadingText = t('common:buttons:savingText');
          return (
            <FormActions
              activeStepIndex={activeStepIndex}
              totalSteps={formSteps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
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
