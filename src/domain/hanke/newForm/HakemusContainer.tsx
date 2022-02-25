import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Formik, useFormikContext } from 'formik';
import { Button } from 'hds-react';
import BasicHankeInfo from './BasicHankeInfo';
import Contacts from './Contacts';
import Geometries from './Geometries';
import Haitat from './Haitat';
import AdditionalInformation from './AdditionalInformation';
import { HakemusFormValues, initialContact } from './types';

interface ButtonProps {
  nextLink?: string;
  backLink?: string;
}

const NavigationButtons: React.FC<ButtonProps> = ({ nextLink, backLink }) => {
  const navigate = useNavigate();
  const formik = useFormikContext();
  return (
    <div>
      {backLink && (
        <Button
          onClick={() => {
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
