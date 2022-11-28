import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Formik, useFormikContext } from 'formik';
import { Button, Notification } from 'hds-react';
import { BasicHankeInfo } from './BasicInfo';

import { JohtoselvitysFormValues } from './types';
import { Contacts } from './Contacts';
import { Geometries } from './Geometries';
import { ReviewAndSend } from './ReviewAndSend';
import api from '../api/api';
import FormPagination from '../forms/components/FormPageIndicator';
import styles from './Johtoselvitys.module.scss';

interface ButtonProps {
  nextPath?: string;
  previousPath?: string;
}

const NavigationButtons: React.FC<ButtonProps> = ({ nextPath, previousPath }) => {
  const navigate = useNavigate();
  const formik = useFormikContext<JohtoselvitysFormValues>();
  const [saveLoading, setSaveLoading] = useState(false);
  const [showSaveOK, setShowSaveOK] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [showPublishOK, setShowPublishOK] = useState(false);
  const [showPublishError, setShowPublishError] = useState(false);

  const saveFormState = async () => {
    setSaveLoading(true);
    try {
      if (formik.values.id) {
        const { data } = await api.put<JohtoselvitysFormValues>(
          `/hakemukset/${formik.values.id}`,
          formik.values
        );
        formik.setValues(data);
      } else {
        const { data } = await api.post<JohtoselvitysFormValues>('/hakemukset', formik.values);
        formik.setValues(data);
      }
      // TODO: HAI-1156
      // TODO: HAI-1159
      setShowSaveOK(true);
    } catch (error) {
      setShowSaveError(true);
    }
    setSaveLoading(false);
  };

  const sendFormToAllu = async () => {
    setPublishLoading(true);
    try {
      await api.post<unknown>(`/hakemukset/${formik.values.id}/send-application`, {});
      setShowPublishOK(true);
    } catch (error) {
      setShowPublishError(true);
    }
    // TODO: HAI-1157
    // TODO: HAI-1158
    setPublishLoading(false);
  };

  return (
    <div className={styles.navButtonContainer}>
      {previousPath && (
        <div className={styles.navPrev}>
          <Button
            variant="secondary"
            onClick={() => {
              // TODO: HAI-1165
              // TODO: HAI-1166
              navigate(`/fi/johtoselvityshakemus${previousPath}`); // TODO: localized links
            }}
          >
            Edellinen
          </Button>
        </div>
      )}
      {nextPath && (
        <div className={styles.navNext}>
          <Button
            variant="secondary"
            onClick={() => {
              // TODO: HAI-1165
              // TODO: HAI-1166
              navigate(`/fi/johtoselvityshakemus${nextPath}`); // TODO: localized links
            }}
          >
            Seuraava
          </Button>
        </div>
      )}
      {!nextPath && ( // Final page reached, provide an action to save
        <>
          <div className={styles.navSave}>
            <Button
              isLoading={saveLoading}
              loadingText="Tallennetaan... "
              onClick={() => {
                saveFormState();
              }}
            >
              Tallenna hakemus
            </Button>
            {showSaveOK && (
              <Notification
                key={new Date().toString()}
                position="top-right"
                displayAutoCloseProgress={false}
                autoClose
                dismissible
                label="Hakemus tallennettu"
                type="success"
                onClose={() => {
                  setShowPublishOK(false);
                }}
                closeButtonLabelText="closebuttonlbl"
              >
                Hakemuksen tallentaminen onnistui
              </Notification>
            )}
            {showSaveError && (
              <Notification
                key={new Date().toString()}
                position="top-right"
                displayAutoCloseProgress={false}
                autoClose
                dismissible
                label="Hakemuksen tallennus epäonnistui"
                type="error"
                onClose={() => {
                  setShowPublishError(false);
                }}
                closeButtonLabelText="closebuttonlbl"
              >
                Hakemusta ei voitu tallentaa. Tarkista hakemuksen oikea sisältö ja että olet
                kirjautunut.
              </Notification>
            )}
          </div>
          <div className={styles.navPublish}>
            <Button
              isLoading={publishLoading}
              loadingText="Lähetetään... "
              // eslint-disable-next-line no-unneeded-ternary
              disabled={formik.values.id ? false : true}
              onClick={() => {
                sendFormToAllu();
                // navigate(`/fi/hakemus${nextPath}`); // TODO: localized links
              }}
            >
              Lähetä hakemus
            </Button>
            {showPublishOK && (
              <Notification
                key={new Date().toString()}
                position="top-right"
                displayAutoCloseProgress={false}
                autoClose
                dismissible
                label="Form saved!"
                type="success"
                onClose={() => {
                  setShowPublishOK(false);
                }}
                closeButtonLabelText="closebuttonlbl"
              >
                Saving your form was successful.
              </Notification>
            )}
            {showPublishError && (
              <Notification
                key={new Date().toString()}
                position="top-right"
                displayAutoCloseProgress={false}
                autoClose
                dismissible
                label="Hakemuksen lähetys epäonnistui"
                type="error"
                onClose={() => {
                  setShowPublishError(false);
                }}
                closeButtonLabelText="closebuttonlbl"
              >
                Hakemusta ei voitu lähettää. Tarkista hakemuksen oikea sisältö ja tiedot.
              </Notification>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const JohtoselvitysContainer: React.FC = () => {
  const navigate = useNavigate();

  const initialValues: JohtoselvitysFormValues = {
    id: null,
    applicationType: 'CABLE_REPORT',
    applicationData: {
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
      startTime: 1646267516.878748,
      endTime: 1646267516.878748,
      pendingOnClient: true,
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

  const formSteps = [
    {
      path: '/',
      element: <BasicHankeInfo />,
      title: 'Perustiedot',
    },
    {
      path: '/contacts',
      element: <Contacts />,
      title: 'Yhteystiedot',
    },
    {
      path: '/alueet',
      element: <Geometries />,
      title: 'Aluetiedot',
    },
    {
      path: '/yhteenveto',
      element: <ReviewAndSend />,
      title: 'Yhteenveto',
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
      >
        <Routes>
          {formSteps.map((formStep, i) => {
            return (
              <Route
                path={formStep.path}
                element={
                  <>
                    <div className={styles.formWrapper}>
                      <div className={styles.pagination}>
                        <FormPagination
                          currentLabel={formStep.title}
                          formPageLabels={formSteps.map((formPage) => formPage.title)}
                          onPageChange={(pageIndex) =>
                            navigate(`/fi/johtoselvityshakemus${formSteps[pageIndex].path}`)
                          }
                        />
                      </div>
                      <div className={styles.content}>{formStep.element}</div>
                      <NavigationButtons
                        nextPath={formSteps[i + 1]?.path}
                        previousPath={formSteps[i - 1]?.path}
                      />{' '}
                    </div>
                  </>
                }
              />
            );
          })}
        </Routes>
      </Formik>
    </>
  );
};

export default JohtoselvitysContainer;
