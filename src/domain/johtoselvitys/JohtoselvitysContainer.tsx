import React from 'react';
import { Button, IconCross, IconSaveDiskette, StepState } from 'hds-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import { JohtoselvitysFormValues } from './types';
import { BasicHankeInfo } from './BasicInfo';
import { Contacts } from './Contacts';
import { Geometries } from './Geometries';
import { ReviewAndSend } from './ReviewAndSend';
import MultipageForm from '../forms/MultipageForm';
import FormActions from '../forms/components/FormActions';
import { validationSchema } from './validationSchema';
import { HankeData } from '../types/hanke';

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
          type: 'PERSON',
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
      pendingOnClient: false,
      identificationNumber: 'HAI-123', // TODO: HAI-1160
      clientApplicationKind: 'HAITATON', // TODO: add to UI
      workDescription: '',
      contractorWithContacts: {
        customer: {
          type: 'COMPANY',
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
            name: '',
            postalAddress: {
              streetAddress: {
                streetName: '',
              },
              postalCode: '',
              city: '',
            },
            email: '',
            phone: '',
            orderer: false,
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
      element: <Contacts />,
      label: t('form:headers:yhteystiedot'),
      state: StepState.disabled,
    },
    {
      element: <ReviewAndSend />,
      label: t('form:headers:yhteenveto'),
      state: StepState.disabled,
    },
  ];

  const hankeNameText = `${t('hankeForm:labels:nimi')} (${hanke.nimi})`;

  return (
    <FormProvider {...formContext}>
      <MultipageForm
        heading={t('johtoselvitysForm:pageHeader')}
        subHeading={hankeNameText}
        formSteps={formSteps}
      >
        {function renderFormActions(activeStepIndex, handlePrevious, handleNext) {
          const lastStep = activeStepIndex === formSteps.length - 1;
          return (
            <FormActions
              activeStepIndex={activeStepIndex}
              totalSteps={formSteps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
            >
              <Button variant="secondary" iconLeft={<IconCross aria-hidden />}>
                {t('hankeForm:cancelButton')}
              </Button>
              {!lastStep && (
                <Button
                  variant="supplementary"
                  iconLeft={<IconSaveDiskette aria-hidden="true" />}
                  data-testid="save-form-btn"
                >
                  {t('hankeForm:saveDraftButton')}
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
