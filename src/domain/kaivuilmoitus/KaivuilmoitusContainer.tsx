import { FormProvider, useForm } from 'react-hook-form';
import { merge } from 'lodash';
import { Button, IconCross, IconSaveDiskette, StepState } from 'hds-react';
import { yupResolver } from '@hookform/resolvers/yup';
import MultipageForm from '../forms/MultipageForm';
import BasicInfo from './BasicInfo';
import { HankeData } from '../types/hanke';
import { useTranslation } from 'react-i18next';
import FormActions from '../forms/components/FormActions';
import { ApplicationCancel } from '../application/components/ApplicationCancel';
import { KaivuilmoitusFormValues } from './types';
import { validationSchema } from './validationSchema';
import { useApplicationsForHanke } from '../application/hooks/useApplications';
import {
  Application,
  KaivuilmoitusCreateData,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
} from '../application/types/application';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';
import { useNavigateToApplicationList } from '../hanke/hooks/useNavigateToApplicationList';
import { convertFormStateToKaivuilmoitusUpdateData } from './utils';
import ApplicationSaveNotification from '../application/components/ApplicationSaveNotification';
import useSaveApplication from '../application/hooks/useSaveApplication';

type Props = {
  hankeData: HankeData;
  application?: Application<KaivuilmoitusData>;
};

export default function KaivuilmoitusContainer({ hankeData, application }: Readonly<Props>) {
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();
  const navigateToApplicationList = useNavigateToApplicationList(hankeData.hankeTunnus);
  const { data: hankkeenHakemukset } = useApplicationsForHanke(hankeData.hankeTunnus);
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
      customerWithContacts: null,
      contractorWithContacts: null,
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
    },
  };
  const formContext = useForm<KaivuilmoitusFormValues>({
    mode: 'onTouched',
    defaultValues: merge(initialValues, application),
    resolver: yupResolver(validationSchema),
  });
  const { getValues, setValue, reset, trigger } = formContext;

  const {
    applicationCreateMutation,
    applicationUpdateMutation,
    showSaveNotification,
    setShowSaveNotification,
  } = useSaveApplication<KaivuilmoitusData, KaivuilmoitusCreateData, KaivuilmoitusUpdateData>({
    onCreateSuccess({ id }) {
      setValue('id', id);
      reset({}, { keepValues: true });
    },
    onUpdateSuccess() {
      reset({}, { keepValues: true });
    },
  });

  const saving = applicationCreateMutation.isLoading || applicationUpdateMutation.isLoading;
  const savingText = t('common:buttons:savingText');

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

  function saveAndQuit() {
    function handleSuccess(data: Application<KaivuilmoitusData>) {
      navigateToApplicationList(data.hankeTunnus);
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

  const formSteps = [
    {
      element: <BasicInfo johtoselvitysIds={johtoselvitysIds} />,
      label: t('form:headers:perustiedot'),
      state: StepState.available,
    },
  ];

  return (
    <FormProvider {...formContext}>
      <MultipageForm
        heading={t('kaivuilmoitusForm:pageHeader')}
        subHeading={`${hankeData.nimi} (${hankeData.hankeTunnus})`}
        formSteps={formSteps}
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

          return (
            <FormActions
              activeStepIndex={activeStepIndex}
              totalSteps={formSteps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
            >
              <ApplicationCancel
                applicationId={getValues('id')}
                alluStatus={getValues('alluStatus')}
                hankeTunnus={hankeData.hankeTunnus}
                buttonIcon={<IconCross />}
                saveAndQuitIsLoading={saving}
                saveAndQuitIsLoadingText={savingText}
              />

              <Button
                variant="secondary"
                onClick={handleSaveAndQuit}
                iconLeft={<IconSaveDiskette />}
                isLoading={saving}
                loadingText={savingText}
              >
                {t('hankeForm:saveDraftButton')}
              </Button>
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
    </FormProvider>
  );
}