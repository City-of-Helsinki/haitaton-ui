import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Formik, useFormikContext } from 'formik';
import { Button } from 'hds-react';
import * as Yup from 'yup';
import {
  BasicHankeInfo,
  initialValues as initialValuesBasicHankeInfo,
  validationSchema as validationBasicHankeInfo,
} from './BasicHankeInfo';
import { Geometries, initialValues as initialValuesGeometries } from './Geometries';
import { Contacts, initialValues as initialValuesContacts } from './Contacts';
import {
  AdditionalInformation,
  initialValues as initialValuesAdditionalInformation,
} from './AdditionalInformation';
import { Haitat, initialValues as initialValuesHaitat } from './Haitat';
import { HakemusFormValues, HankeContact, HANKE_CONTACT_TYPE } from './types';
import { FORMFIELD } from '../edit/types';
import { PartialExcept } from '../../../common/types/utils';
import { HankeContactKey } from '../../types/hanke';
import api from '../../api/api';
import FormPagination from '../../forms/components/FormPageIndicator';
import styles from './HakemusContainer.module.scss';
import GenericForm from '../../forms/GenericForm';

const isContactEmpty = ({
  etunimi,
  sukunimi,
  email,
  puhelinnumero,
  organisaatioNimi,
}: HankeContact) =>
  etunimi === '' &&
  sukunimi === '' &&
  email === '' &&
  puhelinnumero === '' &&
  organisaatioNimi === '';

const filterEmptyContacts = (
  formData: PartialExcept<HakemusFormValues, HankeContactKey>
): PartialExcept<HakemusFormValues, HankeContactKey> => ({
  ...formData,
  [FORMFIELD.OMISTAJAT]: formData[FORMFIELD.OMISTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
  [FORMFIELD.ARVIOIJAT]: formData[FORMFIELD.ARVIOIJAT]?.filter((v) => !isContactEmpty(v)) || [],
  [FORMFIELD.TOTEUTTAJAT]: formData[FORMFIELD.TOTEUTTAJAT]?.filter((v) => !isContactEmpty(v)) || [],
});

interface ButtonProps {
  nextPath?: string;
  previousPath?: string;
  onPageChange: (path: string) => void;
}

const NavigationButtons: React.FC<ButtonProps> = ({ nextPath, previousPath, onPageChange }) => {
  return (
    <div className={styles.navigationButtons}>
      <Button
        variant="secondary"
        className={!previousPath ? styles.hidden : ''}
        onClick={() => {
          onPageChange(`/fi/hakemus${previousPath}`); // TODO: localized links
        }}
      >
        Edellinen
      </Button>

      {nextPath && (
        <Button
          variant="secondary"
          onClick={() => {
            onPageChange(`/fi/hakemus${nextPath}`); // TODO: localized links
          }}
        >
          Seuraava
        </Button>
      )}
      {!nextPath && ( // Final page reached, provide an action to save
        <Button
          onClick={async () => {
            onPageChange(''); // TODO: navigate to hanke on map with a localized link
          }}
        >
          Tallenna
        </Button>
      )}
    </div>
  );
};

const FormContent: React.FC = () => {
  const navigate = useNavigate();
  const formik = useFormikContext<HakemusFormValues>();

  const formSteps = [
    {
      path: '/',
      element: <BasicHankeInfo />,
      title: 'Perustiedot',
      fieldsToValidate: ['nimi', 'kuvaus', 'alkuPvm', 'loppuPvm', 'vaihe'],
    },
    {
      path: '/geometry',
      element: <Geometries />,
      title: 'Alue',
      fieldsToValidate: [],
    },
    {
      path: '/contactdetails',
      element: <Contacts />,
      title: 'Yhteystiedot',
      fieldsToValidate: [],
    },
    {
      path: '/additional-information',
      element: <AdditionalInformation />,
      title: 'Lisätiedot',
      fieldsToValidate: [],
    },
    {
      path: '/haitat',
      element: <Haitat />,
      title: 'Haitat',
      fieldsToValidate: [],
    },
  ];

  function fieldsAreValid(fieldsToValidate: string[]) {
    return new Promise((resolve) => {
      fieldsToValidate.forEach((fieldname) => {
        formik.setFieldTouched(fieldname, true);
      });
      formik.validateForm().then((validationErrors) => {
        resolve(
          !fieldsToValidate.some((fieldToValidate) =>
            Object.keys(validationErrors).includes(fieldToValidate)
          )
        );
      });
    });
  }

  function updateFormFieldsWithAPIResponse(data: HakemusFormValues | Partial<HakemusFormValues>) {
    const dataKeys = Object.keys(data) as Array<keyof HakemusFormValues>;
    dataKeys.forEach((dataKey) => {
      // If there are no contacts, then do not update state as empty contacts
      // are required as initial values for the Contacts.tsx
      if (
        dataKey === HANKE_CONTACT_TYPE.ARVIOIJAT ||
        dataKey === HANKE_CONTACT_TYPE.OMISTAJAT ||
        dataKey === HANKE_CONTACT_TYPE.TOTEUTTAJAT
      ) {
        // .. typescript typeguards
        const contactsData = data[dataKey];
        if (contactsData) {
          const nonUndefinedContactsData: HankeContact[] = contactsData;
          if (nonUndefinedContactsData.length > 0) {
            formik.setFieldValue(dataKey, nonUndefinedContactsData);
          }
        }
      } else {
        formik.setFieldValue(dataKey, data[dataKey]);
      }
    });
  }

  async function saveFormState() {
    const formData = formik.values;
    const dataWithoutEmptyContacts = filterEmptyContacts({
      ...formData,
      omistajat: formData.omistajat ? formData.omistajat : [],
      arvioijat: formData.arvioijat ? formData.arvioijat : [],
      toteuttajat: formData.toteuttajat ? formData.toteuttajat : [],
      saveType: 'DRAFT',
    });
    // When updating a hanke the API takes the entire object
    if (formData.hankeTunnus) {
      const { data } = await api.put<HakemusFormValues>(
        `/hankkeet/${formData.hankeTunnus}`,
        dataWithoutEmptyContacts
      );
      updateFormFieldsWithAPIResponse(data);
    } else {
      const dataWithoutEmptyFields: Partial<HakemusFormValues> = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(dataWithoutEmptyContacts).filter(([key, value]) => {
          return value !== null && value !== '';
        })
      );
      const { data } = await api.post<Partial<HakemusFormValues>>(
        '/hankkeet',
        dataWithoutEmptyFields
      );
      updateFormFieldsWithAPIResponse(data);
    }
  }

  async function handleNavigation(path: string, fieldsToValidate: string[]) {
    if (await fieldsAreValid(fieldsToValidate)) {
      saveFormState();
      if (path !== '') {
        navigate(path);
      }
    }
  }

  function handleDelete() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }

  function handleClose() {
    navigate('/');
  }

  async function handleSave(fieldsToValidate: string[]) {
    if (await fieldsAreValid(fieldsToValidate)) {
      saveFormState();
    }
  }

  return (
    <Routes>
      {formSteps.map((formStep, i) => {
        return (
          <Route
            key={formStep.path}
            path={formStep.path}
            element={
              <GenericForm
                onDelete={handleDelete}
                onClose={handleClose}
                onSave={() => handleSave(formStep.fieldsToValidate)}
                pagination={
                  <FormPagination
                    currentLabel={formStep.title}
                    formPageLabels={formSteps.map((formPage) => formPage.title)}
                    onPageChange={(pageIndex) => {
                      handleNavigation(
                        `/fi/hakemus${formSteps[pageIndex].path}`,
                        formStep.fieldsToValidate
                      );
                    }}
                  />
                }
              >
                <div className={styles.content}>{formStep.element}</div>
                <NavigationButtons
                  nextPath={formSteps[i + 1]?.path}
                  previousPath={formSteps[i - 1]?.path}
                  onPageChange={(path) => {
                    handleNavigation(path, formStep.fieldsToValidate);
                  }}
                />
              </GenericForm>
            }
          />
        );
      })}
    </Routes>
  );
};

const HakemusContainer: React.FC = () => {
  const initialValues: HakemusFormValues = {
    ...initialValuesBasicHankeInfo,
    ...initialValuesGeometries,
    ...initialValuesContacts,
    ...initialValuesAdditionalInformation,
    ...initialValuesHaitat,
    saveType: 'DRAFT',
    liikennehaittaindeksi: null,
    tormaystarkasteluTulos: null,
    createdAt: null,
    createdBy: null,
    modifiedAt: null,
    modifiedBy: null,
    permissions: null,
    version: null,
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          // TODO: maybe needed for entire form validation prior to last page submit?
          // eslint-disable-next-line @typescript-eslint/no-empty-function
        }}
        validationSchema={Yup.object().shape({ ...validationBasicHankeInfo })}
      >
        <FormContent />
      </Formik>
    </>
  );
};

export default HakemusContainer;
