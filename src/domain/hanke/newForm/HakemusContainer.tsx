import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Formik, useFormikContext } from 'formik';
import { Button } from 'hds-react';
import BasicHankeInfo from './BasicHankeInfo';
import Contacts from './Contacts';
import Geometries from './Geometries';
import Haitat from './Haitat';
import AdditionalInformation from './AdditionalInformation';
import { HakemusFormValues, HankeContact, initialContact } from './types';
import { FORMFIELD } from '../edit/types';
import { PartialExcept } from '../../../common/types/utils';
import { HankeContactKey } from '../../types/hanke';
import api from '../../api/api';

interface ButtonProps {
  nextLink?: string;
  backLink?: string;
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

const NavigationButtons: React.FC<ButtonProps> = ({ nextLink, backLink }) => {
  const navigate = useNavigate();
  const formik = useFormikContext<HakemusFormValues>();

  const saveFormState = async () => {
    const formData = formik.values;
    const dataWithoutEmptyFields: Partial<HakemusFormValues> = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(formData).filter(([key, value]) => {
        return value !== null && value !== '';
      })
    );
    const dataWithoutEmptyContacts = filterEmptyContacts({
      ...dataWithoutEmptyFields,
      omistajat: dataWithoutEmptyFields.omistajat ? dataWithoutEmptyFields.omistajat : [],
      arvioijat: dataWithoutEmptyFields.arvioijat ? dataWithoutEmptyFields.arvioijat : [],
      toteuttajat: dataWithoutEmptyFields.toteuttajat ? dataWithoutEmptyFields.toteuttajat : [],
      saveType: 'DRAFT',
    });

    const response = formData.hankeTunnus
      ? await api.put<Partial<HakemusFormValues>>(
          `/hankkeet/${formData.hankeTunnus}`,
          dataWithoutEmptyContacts
        )
      : await api.post<Partial<HakemusFormValues>>('/hankkeet', dataWithoutEmptyContacts);
    console.log('Response received after saving hakemus');
    console.log(response);
  };
  return (
    <div>
      {backLink && (
        <Button
          onClick={() => {
            saveFormState();
            navigate(`/fi/hakemus${backLink}`); // TODO: localized links
          }}
        >
          {backLink}
        </Button>
      )}
      {nextLink && (
        <Button
          onClick={() => {
            console.log('Next clicked');
            console.log(formik.values);
            saveFormState();
            navigate(`/fi/hakemus${nextLink}`); // TODO: localized links
          }}
        >
          {nextLink}
        </Button>
      )}
      <Button
        onClick={() => {
          formik.submitForm();
        }}
      >
        Submit
      </Button>
    </div>
  );
};

const HakemusContainer: React.FC = () => {
  const initialValues: HakemusFormValues = {
    hankeTunnus: '',
    onYKTHanke: false,
    nimi: '',
    alkuPvm: '',
    loppuPvm: '',
    kuvaus: '',
    hakijanNimi: '',
    vaihe: '',
    suunnitteluVaihe: null,
    tyomaaKatuosoite: '',
    haittaAlkuPvm: '',
    haittaLoppuPvm: '',
    kaistaHaitta: null,
    kaistaPituusHaitta: null,
    meluHaitta: null,
    polyHaitta: null,
    tarinaHaitta: null,
    geometriat: null,
    omistajat: [initialContact],
    toteuttajat: [initialContact],
    arvioijat: [initialContact],
    saveType: 'DRAFT',
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
        onSubmit={(values, actions) => {
          console.log('Formik has submitted');
          console.log({ values, actions });
        }}
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
                      nextLink={formSteps[i + 1]?.path}
                      backLink={formSteps[i - 1]?.path}
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
