import { useTranslation } from 'react-i18next';
import { FieldPath, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, IconSaveDiskette, StepState } from 'hds-react';
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
import { getJohtoselvitysIdentifiers } from '../application/utils';
import { KaivuilmoitusMuutosilmoitusFormValues } from './types';
import { validationSchema } from './validationSchema';
import ReviewAndSend from './ReviewAndSend';
import useAttachments from '../application/hooks/useAttachments';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';
import useNavigateToApplicationView from '../application/hooks/useNavigateToApplicationView';

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
    formState: { isDirty },
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

  function handleStepChange() {
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

          return (
            <FormActions
              activeStepIndex={activeStep}
              totalSteps={formSteps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
            >
              <Button
                variant="secondary"
                onClick={handleSaveAndQuit}
                iconLeft={<IconSaveDiskette />}
                isLoading={saveAndQuitIsLoading}
                loadingText={saveAndQuitLoadingText}
              >
                {t('hankeForm:saveDraftButton')}
              </Button>
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
    </FormProvider>
  );
}
