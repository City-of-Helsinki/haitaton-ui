import { FormProvider, useForm } from 'react-hook-form';
import { Button, IconCross, IconSaveDiskette, StepState } from 'hds-react';
import MultipageForm from '../forms/MultipageForm';
import BasicInfo from './BasicInfo';
import { HankeData } from '../types/hanke';
import { useTranslation } from 'react-i18next';
import FormActions from '../forms/components/FormActions';
import { ApplicationCancel } from '../application/components/ApplicationCancel';
import { KaivuilmoitusFormValues } from './types';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from './validationSchema';
import { useApplicationsForHanke } from '../application/hooks/useApplications';
import { useMutation } from 'react-query';
import { saveHakemus } from '../application/utils';
import { Application, KaivuilmoitusData } from '../application/types/application';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';
import { useNavigateToApplicationList } from '../hanke/hooks/useNavigateToApplicationList';
import { merge } from 'lodash';

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
      rockExcavation: null,
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

  const applicationSaveMutation = useMutation(saveHakemus<KaivuilmoitusData>, {
    onSuccess({ id }) {
      setValue('id', id);
      reset({}, { keepValues: true });
    },
  });
  const saving = applicationSaveMutation.isLoading;
  const savingText = t('common:buttons:savingText');

  function saveAndQuit() {
    const formData = getValues();

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

    applicationSaveMutation.mutate(
      {
        data: formData,
        convertFormStateToUpdateData: (data) => data,
      },
      {
        onSuccess: handleSuccess,
      },
    );
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
    </FormProvider>
  );
}
