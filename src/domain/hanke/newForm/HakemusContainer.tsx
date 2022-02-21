import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import BasicHankeInfo from './BasicHankeInfo';
import ContactDetails from './ContactDetails';
import Geometries from './Geometries';
import Attachments from './Attachments';

const HakemusContainer: React.FC = () => {
  const formContext = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {},
    resolver: undefined,
    context: undefined,
    criteriaMode: 'all',
    shouldFocusError: true,
    shouldUnregister: false,
  });
  const formSteps = [
    {
      path: '/',
      element: <BasicHankeInfo />,
      title: 'Perustiedot',
    },
    {
      path: '/contactdetails',
      element: <ContactDetails />,
      title: 'Yhteystiedot',
    },
    {
      path: '/geometry',
      element: <Geometries />,
      title: 'Aluetiedot',
    },
    {
      path: '/attachments',
      element: <Attachments />,
      title: 'Liitteet',
    },
  ];
  return (
    <>
      <FormProvider {...formContext}>
        <Routes>
          {formSteps.map((formStep) => {
            return <Route path={formStep.path} element={formStep.element} />;
          })}
        </Routes>
      </FormProvider>
    </>
  );
};

export default HakemusContainer;
