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

interface ButtonProps {
  nextPath?: string;
  previousPath?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  path: string;
}

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

const NavigationButtons: React.FC<ButtonProps> = ({ nextPath, previousPath, path }) => {
  const navigate = useNavigate();
  const formik = useFormikContext<HakemusFormValues>();

  const fieldsInPathAreValid = (pathToValidate: string) => {
    console.log('VALIDATE FIELDS IN PATH, hard code for now with a switch');
    console.log(pathToValidate);
    formik.validateField('alkuPvm');
    formik.validateField('nimi');
    return false;
  };

  const updateFormFieldsWithAPIResponse = (
    data: HakemusFormValues | Partial<HakemusFormValues>
  ) => {
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
  };

  const saveFormState = async () => {
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
  };
  return (
    <div>
      {previousPath && (
        <Button
          onClick={() => {
            // TODO: trigger form validation, continue if OK
            if (fieldsInPathAreValid(path)) {
              saveFormState();
              navigate(`/fi/hakemus${previousPath}`); // TODO: localized links
            }
          }}
        >
          {previousPath}
        </Button>
      )}
      {nextPath && (
        <Button
          onClick={() => {
            // TODO: trigger form validation, continue if OK
            // for field in currentFormStep.fields
            // formik.validateField(field)
            if (fieldsInPathAreValid(path)) {
              saveFormState();
              navigate(`/fi/hakemus${nextPath}`); // TODO: localized links
            }
          }}
        >
          {nextPath}
        </Button>
      )}
      {!nextPath && ( // Final page reached, provide an action to save
        <Button
          onClick={() => {
            saveFormState();
            // navigate(`/fi/hakemus${nextPath}`); // TODO: localized links
          }}
        >
          Tallenna
        </Button>
      )}
    </div>
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

  const formSteps = [
    {
      path: '/',
      element: <BasicHankeInfo />,
      title: 'Perustiedot',
    },
    {
      path: '/geometry',
      element: <Geometries />,
      title: 'Hankkeen alue',
    },
    {
      path: '/contactdetails',
      element: <Contacts />,
      title: 'Yhteystiedot',
    },
    {
      path: '/additional-information',
      element: <AdditionalInformation />,
      title: 'Hankkeen lisätiedot',
    },
    {
      path: '/haitat',
      element: <Haitat />,
      title: 'Hankkeen haitat',
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
        validationSchema={Yup.object().shape({ ...validationBasicHankeInfo })}
      >
        <Routes>
          {formSteps.map((formStep, i) => {
            return (
              <Route
                path={formStep.path}
                element={
                  <>
                    {formStep.element}
                    <NavigationButtons
                      path={formStep.path}
                      nextPath={formSteps[i + 1]?.path}
                      previousPath={formSteps[i - 1]?.path}
                    />
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

export default HakemusContainer;
