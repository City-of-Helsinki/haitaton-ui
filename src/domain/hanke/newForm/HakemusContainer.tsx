import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner, Notification } from 'hds-react';
import { Flex } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import {
  BasicHankeInfo,
  initialValues as initialValuesBasicHankeInfo,
  validationSchema as validationBasicHankeInfo,
} from './BasicHankeInfo';
import { Geometries, initialValues as initialValuesGeometries } from './Geometries';
import {
  Contacts,
  contactsValidationSchema,
  initialContact,
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
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import ConfirmationDialog from '../../../common/components/HDSConfirmationDialog/ConfirmationDialog';

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

// If there are no contacts (contacts array is empty), set those contacts to initial values
// as empty contacts are required as initial values for the Contacts.tsx
function initializeNonExistingContacts(data: HakemusFormValues) {
  const clonedData: HakemusFormValues = JSON.parse(JSON.stringify(data));

  if (clonedData[HANKE_CONTACT_TYPE.OMISTAJAT]?.length === 0) {
    clonedData[HANKE_CONTACT_TYPE.OMISTAJAT] = [initialContact];
  }
  if (clonedData[HANKE_CONTACT_TYPE.ARVIOIJAT]?.length === 0) {
    clonedData[HANKE_CONTACT_TYPE.ARVIOIJAT] = [initialContact];
  }
  if (clonedData[HANKE_CONTACT_TYPE.TOTEUTTAJAT]?.length === 0) {
    clonedData[HANKE_CONTACT_TYPE.TOTEUTTAJAT] = [initialContact];
  }

  return clonedData;
}

async function getHanke(hankeTunnus?: string) {
  const { data } = await api.get<HakemusFormValues>(`/hankkeet/${hankeTunnus}`);
  return data;
}

const FormContent: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formik = useFormikContext<HakemusFormValues>();
  const { HANKEPORTFOLIO } = useLocalizedRoutes();

  const formSteps = [
    {
      path: '/',
      element: <BasicHankeInfo />,
      title: 'Perustiedot',
      fieldsToValidate: ['nimi', 'kuvaus', 'alkuPvm', 'loppuPvm', 'vaihe'],
    },
    {
      // TODO: localized links
      path: '/yhteystiedot',
      element: <Contacts />,
      title: 'Yhteystiedot',
      fieldsToValidate: [],
    },
    {
      path: '/alueet',
      element: <Geometries />,
      title: 'Aluetiedot',
      fieldsToValidate: [],
    },
  ];

  const [showNotification, setShowNotification] = useState('' as 'success' | 'error' | '');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');

  function updateFormFieldsWithAPIResponse(data: HakemusFormValues) {
    formik.setValues(initializeNonExistingContacts(data));
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
      // Save geometries first if any
      if (formik.values.hankeTunnus && formik.values.geometriat) {
        await api.post<HankeGeometryApiResponseData>(
          `/hankkeet/${formik.values.hankeTunnus}/geometriat`,
          {
            featureCollection: formik.values.geometriat,
          }
        );
      }
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
        const { data } = await api.post<HakemusFormValues>('/hankkeet', dataWithoutEmptyFields);
        updateFormFieldsWithAPIResponse(data);
      }
      setShowNotification('success');
    } catch (error) {
      setShowNotification('error');
    }
  }

  function deleteHanke(hankeTunnus: string) {
    return api.delete<Partial<HakemusFormValues>>(`/hankkeet/${hankeTunnus}`);
  }

  function handleDelete() {
    if (formik.values.hankeTunnus) {
      deleteHanke(formik.values.hankeTunnus)
        .then(() => {
          setDeleteDialogOpen(false);
          navigate(HANKEPORTFOLIO.path);
        })
        .catch(() => {
          setDeleteErrorMsg(t('common:error'));
        });
    }
  }

  function openDeleteDialog() {
    setDeleteDialogOpen(true);
  }

  function handleClose() {
    navigate('/');
  }

  return (
    <>
      <ConfirmationDialog
        title={t('common:confirmationDialog:deleteDialog:titleText')}
        description={t('common:confirmationDialog:deleteDialog:bodyText')}
        isOpen={deleteDialogOpen}
        close={() => {
          setDeleteDialogOpen(false);
          setDeleteErrorMsg('');
        }}
        mainAction={() => handleDelete()}
        mainBtnLabel={t('common:confirmationDialog:deleteDialog:exitButton')}
        variant="danger"
        errorMsg={deleteErrorMsg}
      />
      <GenericForm<HakemusFormValues>
        formSteps={formSteps}
        showNotification={showNotification}
        hankeIndexData={formik.values.tormaystarkasteluTulos}
        onDelete={openDeleteDialog}
        onClose={handleClose}
        onSave={saveFormState}
      />
    </>
  );
};

const HakemusContainer: React.FC<{ hankeTunnus?: string }> = ({ hankeTunnus }) => {
  const { t } = useTranslation();
  const { data: hankeData, isLoading, isError } = useQuery(
    ['hanke', hankeTunnus],
    () => getHanke(hankeTunnus),
    { enabled: Boolean(hankeTunnus) }
  );

  const existingValues = hankeData ? initializeNonExistingContacts(hankeData) : null;

  const initialValues: HakemusFormValues = {
    ...initialValuesBasicHankeInfo,
    ...initialValuesGeometries,
    ...initialValuesContacts,
    ...initialValuesHaitat,
    ...existingValues,
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

  if (isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Notification size="small" type="error">
        {t('common:error')}
      </Notification>
    );
  }

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
