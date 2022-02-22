import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Formik, useFormikContext } from 'formik';
import { Button } from 'hds-react';
import * as Yup from 'yup';
import BasicHankeInfo from './BasicHankeInfo';
import ContactDetails from './ContactDetails';
import Geometries from './Geometries';
import Attachments from './Attachments';
import { HakemusFormValues } from './types';

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
            navigate(`/fi/hakemus${nextLink}`); // TODO: localized links
          }}
        >
          {nextLink}
        </Button>
      )}
      <Button onClick={() => formik.submitForm()}>Submit</Button>
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
      element: <ContactDetails />,
      title: 'Yhteystiedot',
    },
    {
      path: '/attachments',
      element: <Attachments />,
      title: 'Liitteet',
    },
  ];
  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          console.log({ values, actions });
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }}
        validationSchema={Yup.object().shape({
          nimi: Yup.string().required('Please enter this text'),
          kuvaus: Yup.string().required('Please enter your kuvaus text'),
          hakijanNimi: Yup.string().required('Please enter hakijanNimi'),
        })}
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
