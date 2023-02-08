import React, { useState } from 'react';
import {
  Button,
  IconCross,
  IconEnvelope,
  IconSaveDiskette,
  Notification,
  StepState,
} from 'hds-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';

import { JohtoselvitysFormValues } from './types';
import { BasicHankeInfo } from './BasicInfo';
import { Contacts } from './Contacts';
import { Geometries } from './Geometries';
import { ReviewAndSend } from './ReviewAndSend';
import MultipageForm from '../forms/MultipageForm';
import FormActions from '../forms/components/FormActions';
import { validationSchema } from './validationSchema';
import { findOrdererKey } from './utils';
import { changeFormStep } from '../forms/utils';
import { saveApplication, sendApplication } from '../application/utils';
import { HankeContacts, HankeData } from '../types/hanke';

type Props = {
  hanke: HankeData;
};

const JohtoselvitysContainer: React.FC<Props> = ({ hanke }) => {
  const { t } = useTranslation();

  const initialValues: JohtoselvitysFormValues = {
    id: null,
    applicationType: 'CABLE_REPORT',
    applicationData: {
      hankeTunnus: hanke.hankeTunnus,
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
          ovt: null, // TODO: add to frontend
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
      geometry: {
        type: 'GeometryCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:3879',
          },
        },
        geometries: [],
      },
      startTime: null,
      endTime: null,
      pendingOnClient: true,
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
          ovt: null, // TODO: add to frontend
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
    },
  };

  const formContext = useForm<JohtoselvitysFormValues>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
    shouldUnregister: false,
    defaultValues: initialValues,
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
      if (!getValues().id) {
        setValue('id', data.id);
      }
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

  async function saveCableApplication() {
    return applicationSaveMutation.mutateAsync(getValues());
  }

  async function sendCableApplication() {
    let { id } = getValues();
    // If for some reason application has not been saved before
    // sending, meaning id is null, save it before sending
    if (!id) {
      const responseData = await saveCableApplication();
      setShowSaveNotification(false);
      id = responseData.id as number;
    }
    applicationSendMutation.mutate(id);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageFieldsToValidate: any[][] = [
    // Basic information page
    [
      'applicationData.name',
      'applicationData.postalAddress',
      'applicationData.workDescription',
      `applicationData.${findOrdererKey(getValues('applicationData'))}.contacts`,
    ],
    // Areas page
    ['applicationData.startTime', 'applicationData.endTime'],
    // Contacts page
    [
      'applicationData.customerWithContacts',
      'applicationData.contractorWithContacts',
      getValues().applicationData.propertyDeveloperWithContacts &&
        'applicationData.propertyDeveloperWithContacts',
      getValues().applicationData.representativeWithContacts &&
        'applicationData.representativeWithContacts',
    ],
  ];

  const hankeNameText = `${hanke.nimi} (${hanke.hankeTunnus})`;

  return (
    <FormProvider {...formContext}>
      {/* Notification for saving application */}
      {showSaveNotification && (
        <Notification
          position="top-right"
          dismissible
          displayAutoCloseProgress={false}
          autoClose
          label={
            applicationSaveMutation.isSuccess
              ? t('hakemus:notifications:saveSuccessLabel')
              : t('hakemus:notifications:saveErrorLabel')
          }
          type={applicationSaveMutation.isSuccess ? 'success' : 'error'}
          closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
          onClose={() => setShowSaveNotification(false)}
        >
          {applicationSaveMutation.isSuccess
            ? t('hakemus:notifications:saveSuccessText')
            : t('hakemus:notifications:saveErrorText')}
        </Notification>
      )}

      {/* Notification for sending application */}
      {showSendNotification && (
        <Notification
          position="top-right"
          dismissible
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

          const lastStep = activeStepIndex === formSteps.length - 1;
          return (
            <FormActions
              activeStepIndex={activeStepIndex}
              totalSteps={formSteps.length}
              onPrevious={handlePrevious}
              onNext={handleNextPage}
            >
              <Button variant="secondary" iconLeft={<IconCross aria-hidden />}>
                {t('hankeForm:cancelButton')}
              </Button>

              <Button
                variant="secondary"
                iconLeft={<IconSaveDiskette aria-hidden="true" />}
                data-testid="save-form-btn"
                onClick={saveCableApplication}
                isLoading={applicationSaveMutation.isLoading}
                loadingText="Tallennetaan"
              >
                {t('hankeForm:saveDraftButton')}
              </Button>

              {lastStep && (
                <Button
                  type="submit"
                  iconLeft={<IconEnvelope aria-hidden="true" />}
                  isLoading={applicationSendMutation.isLoading}
                  loadingText="Lähetetään"
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
