import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import {
  BasicHankeInfo,
  initialValues as initialValuesBasicHankeInfo,
  validationSchema as validationBasicHankeInfo,
} from './BasicHankeInfo';
import { Geometries, initialValues as initialValuesGeometries } from './Geometries';
import {
  Contacts,
  contactsValidationSchema,
  initialValues as initialValuesContacts,
} from './Contacts';
import { initialValues as initialValuesHaitat } from './Haitat';
import { HakemusFormValues, HankeContact, HANKE_CONTACT_TYPE } from './types';
import { FORMFIELD } from '../edit/types';
import { PartialExcept } from '../../../common/types/utils';
import { HankeContactKey } from '../../types/hanke';
import api from '../../api/api';
import GenericForm from '../../forms/GenericForm';
import { HankeGeometryApiResponseData } from '../../map/types';

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
      path: '/contactdetails',
      element: <Contacts />,
      title: 'Yhteystiedot',
      fieldsToValidate: [],
    },
    {
      path: '/geometry',
      element: <Geometries />,
      title: 'Aluetiedot',
      fieldsToValidate: [],
    },
  ];

  const [showNotification, setShowNotification] = useState('' as 'success' | 'error' | '');

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
    setShowNotification('');

    const formData = formik.values;
    const dataWithoutEmptyContacts = filterEmptyContacts({
      ...formData,
      omistajat: formData.omistajat ? formData.omistajat : [],
      arvioijat: formData.arvioijat ? formData.arvioijat : [],
      toteuttajat: formData.toteuttajat ? formData.toteuttajat : [],
      saveType: 'DRAFT',
    });
    try {
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
      if (formik.values.hankeTunnus && formik.values.geometriat) {
        // Save geometries
        await api.post<HankeGeometryApiResponseData>(
          `/hankkeet/${formik.values.hankeTunnus}/geometriat`,
          {
            featureCollection: formik.values.geometriat,
          }
        );
      }
      setShowNotification('success');
    } catch (error) {
      setShowNotification('error');
    }
  }

  function handleDelete() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }

  function handleClose() {
    navigate('/');
  }

  return (
    <GenericForm<HakemusFormValues>
      formSteps={formSteps}
      showNotification={showNotification}
      formBasePath="/fi/hakemus" // TODO: localized links
      onDelete={handleDelete}
      onClose={handleClose}
      onSave={saveFormState}
    />
  );
};

const HakemusContainer: React.FC = () => {
  const initialValues: HakemusFormValues = {
    ...initialValuesBasicHankeInfo,
    ...initialValuesGeometries,
    ...initialValuesContacts,
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
    <Formik
      initialValues={initialValues}
      onSubmit={() => {
        // TODO: maybe needed for entire form validation prior to last page submit?
        // eslint-disable-next-line @typescript-eslint/no-empty-function
      }}
      validationSchema={Yup.object().shape({
        ...validationBasicHankeInfo,
        ...contactsValidationSchema,
      })}
    >
      <FormContent />
    </Formik>
  );
};

export default HakemusContainer;
