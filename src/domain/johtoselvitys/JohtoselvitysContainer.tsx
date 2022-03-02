import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  BasicHankeInfo,
  initialValues as initialValuesBasicHankeInfo,
  validationSchema as validationBasicInfo,
} from './BasicInfo';

import { JohtoselvitysFormValues } from './types';

const JohtoselvitysContainer: React.FC = () => {
  const initialValues: JohtoselvitysFormValues = {
    ...initialValuesBasicHankeInfo,
    id: undefined,
    userId: null,
    applicationType: 'CABLE_APPLICATION',
    applicationData: {
      name: '',
      customerWithContacts: {
        customer: {
          type: '',
          name: '',
          country: '',
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
          ovt: '',
          invoicingOperator: '',
          sapCustomerNumber: '',
        },
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
          orderer: true,
        },
      ],
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
      identificationNumber: '',
      clientApplicationKind: '',
      workDescription: '',
      contractorWithContacts: {
        customer: {
          type: '',
          name: '',
          country: '',
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
      postalAddress: '',
      representativeWithContacts: null,
      invoicingCustomer: null,
      customerReference: null,
      area: null,
      propertyDeveloperWithContacts: null,
      constructionWork: true,
      maintenanceWork: false,
      emergencyWork: false,
      propertyConnectivity: false,
    },
  };

  const formSteps = [
    {
      path: '/',
      element: <BasicHankeInfo />,
      title: 'Perustiedot',
    },
  ];

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          // TODO: maybe needed for entire form validation prior to last page submit?
          // eslint-disable-next-line @typescript-eslint/no-empty-function
        }}
        validationSchema={Yup.object().shape({ ...validationBasicInfo })}
      >
        <Routes>
          {formSteps.map((formStep) => {
            return <Route path={formStep.path} element={<>{formStep.element}</>} />;
          })}
        </Routes>
      </Formik>
    </>
  );
};

export default JohtoselvitysContainer;
