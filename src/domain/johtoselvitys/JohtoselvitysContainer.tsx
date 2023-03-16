import React, { useState } from 'react';
import { Button, IconEnvelope, IconSaveDiskette, Notification, StepState } from 'hds-react';
import { FormProvider, useForm, FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { merge } from 'lodash';

import { JohtoselvitysFormValues } from './types';
import { BasicHankeInfo } from './BasicInfo';
import { Contacts } from './Contacts';
import { Geometries } from './Geometries';
import { ReviewAndSend } from './ReviewAndSend';
import MultipageForm from '../forms/MultipageForm';
import FormActions from '../forms/components/FormActions';
import { validationSchema } from './validationSchema';
import { convertFormStateToApplicationData, findOrdererKey } from './utils';
import { changeFormStep } from '../forms/utils';
import { saveApplication, sendApplication } from '../application/utils';
import { HankeContacts, HankeData } from '../types/hanke';
import { ApplicationCancel } from '../application/components/ApplicationCancel';
import ApplicationSaveNotification from '../application/components/ApplicationSaveNotification';
import useNavigateToApplicationList from '../hanke/hooks/useNavigateToApplicationList';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';

type Props = {
  hanke: HankeData;
  application?: JohtoselvitysFormValues;
};

const JohtoselvitysContainer: React.FC<Props> = ({ hanke, application }) => {
  const { t } = useTranslation();
  const navigateToApplicationList = useNavigateToApplicationList(hanke.hankeTunnus);
  const { setNotification } = useGlobalNotification();

  const initialValues: JohtoselvitysFormValues = {
    id: null,
    alluStatus: null,
    applicationType: 'CABLE_REPORT',
    hankeTunnus: hanke.hankeTunnus,
    applicationData: {
      applicationType: 'CABLE_REPORT',
      name: '',
      customerWithContacts: {
        customer: {
          type: null,
          name: '',
          country: 'FI',
          postalAddress: {
            streetAddress: {
              streetName: '',
            },
            postalCode: '',
            city: '',
          },
          email: '',
          phone: '',
          registryKey: '',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            email: '',
            name: '',
            orderer: true,
            phone: '',
            postalAddress: { city: '', postalCode: '', streetAddress: { streetName: '' } },
          },
        ],
      },
      areas: [],
      startTime: null,
      endTime: null,
      identificationNumber: 'HAI-123', // TODO: HAI-1160
      clientApplicationKind: 'HAITATON', // TODO: add to UI
      workDescription: '',
      contractorWithContacts: {
        customer: {
          type: null,
          name: '',
          country: 'FI',
          postalAddress: {
            streetAddress: {
              streetName: '',
            },
            postalCode: '',
            city: '',
          },
          email: '',
          phone: '',
          registryKey: '',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            email: '',
            name: '',
            orderer: false,
            phone: '',
            postalAddress: { city: '', postalCode: '', streetAddress: { streetName: '' } },
          },
        ],
      },
      postalAddress: null,
      representativeWithContacts: null,
      invoicingCustomer: null,
      customerReference: null,
      area: null,
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
    shouldFocusError: false,
    shouldUnregister: false,
    defaultValues: merge(initialValues, application),
    resolver: yupResolver(validationSchema),
  });

  const { getValues, setValue, handleSubmit, trigger } = formContext;

  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [showSendNotification, setShowSendNotification] = useState(false);

  const applicationSaveMutation = useMutation(saveApplication, {
    onMutate() {
      setShowSaveNotification(false);
    },
    onSuccess(data) {
      setValue('id', data.id);
      setValue('alluStatus', data.alluStatus);
    },
    onSettled() {
      setShowSaveNotification(true);
    },
  });

  const applicationSendMutation = useMutation(sendApplication, {
    onMutate() {
      setShowSendNotification(false);
    },
    onSettled() {
      setShowSendNotification(true);
    },
  });

  function saveCableApplication() {
    const data = convertFormStateToApplicationData(getValues());
    applicationSaveMutation.mutate(data);
  }

  async function sendCableApplication() {
    const data = getValues();
    let { id } = data;
    // If for some reason application has not been saved before
    // sending, meaning id is null, save it before sending
    if (!id) {
      try {
        const responseData = await applicationSaveMutation.mutateAsync(
          convertFormStateToApplicationData(data)
        );
        setShowSaveNotification(false);
        id = responseData.id as number;
      } catch (error) {
        return;
      }
    }
    applicationSendMutation.mutate(id);
  }

  function saveAndQuit() {
    saveCableApplication();

    navigateToApplicationList();

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

  const hankeContacts: HankeContacts = [
    hanke.omistajat,
    hanke.rakennuttajat,
    hanke.toteuttajat,
    hanke.muut,
  ];

  const formSteps = [
    {
      element: <BasicHankeInfo />,
      label: t('form:headers:perustiedot'),
      state: StepState.available,
    },
    {
      element: <Geometries />,
      label: t('form:headers:alueet'),
      state: StepState.disabled,
    },
    {
      element: <Contacts hankeContacts={hankeContacts} />,
      label: t('form:headers:yhteystiedot'),
      state: StepState.disabled,
    },
    {
      element: <ReviewAndSend />,
      label: t('form:headers:yhteenveto'),
      state: StepState.disabled,
    },
  ];

  // Fields that are validated in each page when moving forward in form
  const pageFieldsToValidate: FieldPath<JohtoselvitysFormValues>[][] = [
    // Basic information page
    [
      'applicationData.name',
      'applicationData.postalAddress',
      'applicationData.workDescription',
      `applicationData.${findOrdererKey(getValues('applicationData'))}.contacts`,
      'applicationData.rockExcavation',
      'applicationData.constructionWork',
    ],
    // Areas page
    ['applicationData.startTime', 'applicationData.endTime', 'applicationData.areas'],
    // Contacts page
    [
      'applicationData.customerWithContacts',
      'applicationData.contractorWithContacts',
      'applicationData.propertyDeveloperWithContacts',
      'applicationData.representativeWithContacts',
    ],
  ];

  const hankeNameText = `${hanke.nimi} (${hanke.hankeTunnus})`;

  return (
    <FormProvider {...formContext}>
      {/* Notification for saving application */}
      {showSaveNotification && (
        <ApplicationSaveNotification
          saveSuccess={applicationSaveMutation.isSuccess}
          onClose={() => setShowSaveNotification(false)}
        />
      )}

      {/* Notification for sending application */}
      {showSendNotification && (
        <Notification
          position="top-right"
          dismissible
          displayAutoCloseProgress
          autoClose
          autoCloseDuration={8000}
          label={
            applicationSendMutation.isSuccess
              ? t('hakemus:notifications:sendSuccessLabel')
              : t('hakemus:notifications:sendErrorLabel')
          }
          type={applicationSendMutation.isSuccess ? 'success' : 'error'}
          closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
          onClose={() => setShowSendNotification(false)}
        >
          {applicationSendMutation.isSuccess
            ? t('hakemus:notifications:sendSuccessText')
            : t('hakemus:notifications:sendErrorText')}
        </Notification>
      )}

      <MultipageForm
        heading={t('johtoselvitysForm:pageHeader')}
        subHeading={hankeNameText}
        formSteps={formSteps}
        onStepChange={saveCableApplication}
        onSubmit={handleSubmit(sendCableApplication)}
      >
        {function renderFormActions(activeStepIndex, handlePrevious, handleNext) {
          function handleNextPage() {
            changeFormStep(handleNext, pageFieldsToValidate[activeStepIndex], trigger);
          }

          const firstStep = activeStepIndex === 0;
          const lastStep = activeStepIndex === formSteps.length - 1;
          return (
            <FormActions
              activeStepIndex={activeStepIndex}
              totalSteps={formSteps.length}
              onPrevious={handlePrevious}
              onNext={handleNextPage}
            >
              <ApplicationCancel
                applicationId={getValues('id')}
                alluStatus={getValues('alluStatus')}
                hankeTunnus={hanke.hankeTunnus}
              />

              {!firstStep && (
                <Button
                  variant="secondary"
                  iconLeft={<IconSaveDiskette aria-hidden="true" />}
                  data-testid="save-form-btn"
                  onClick={saveAndQuit}
                  isLoading={applicationSaveMutation.isLoading}
                  loadingText={t('common:buttons:savingText')}
                >
                  {t('hankeForm:saveDraftButton')}
                </Button>
              )}

              {lastStep && (
                <Button
                  type="submit"
                  iconLeft={<IconEnvelope aria-hidden="true" />}
                  isLoading={applicationSendMutation.isLoading}
                  loadingText={t('common:buttons:sendingText')}
                >
                  {t('hakemus:buttons:sendApplication')}
                </Button>
              )}
            </FormActions>
          );
        }}
      </MultipageForm>
    </FormProvider>
  );
};

export default JohtoselvitysContainer;
