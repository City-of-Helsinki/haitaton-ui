import React, { useState, useEffect, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import Text from '../../../common/components/text/Text';
import { FormNotification, HankeDataFormState } from './types';
import { hankeSchema } from './hankeSchema';
import Form0 from './HankeForm0';
import Form1 from './HankeForm1';
import Form2 from './HankeForm2';
import FormNotifications from './components/FormNotifications';
import './HankeForm.styles.scss';
import { HANKE_SAVETYPE } from '../../types/hanke';
import { filterEmptyContacts, isHankeEditingDisabled } from './utils';
import api from '../../api/api';
import GenericForm from '../../forms/GenericForm';

async function saveHanke(data: HankeDataFormState, saveType = HANKE_SAVETYPE.DRAFT) {
  const requestData = {
    ...filterEmptyContacts(data),
    saveType,
  };

  if (isHankeEditingDisabled(data)) {
    throw new Error('Editing disabled');
  }

  if (data.hankeTunnus && data.geometriat) {
    await api.post(`/hankkeet/${data.hankeTunnus}/geometriat`, {
      featureCollection: data.geometriat,
    });
  }

  const response = data.hankeTunnus
    ? await api.put<HankeDataFormState>(`/hankkeet/${data.hankeTunnus}`, requestData)
    : await api.post<HankeDataFormState>(`/hankkeet`, requestData);

  return response.data;
}

type Props = {
  formData: HankeDataFormState;
  onIsDirtyChange: (isDirty: boolean) => void;
  onFormClose: () => void;
  onOpenHankeDelete: () => void;
  children: React.ReactNode;
};

const HankeForm: React.FC<Props> = ({
  formData,
  onIsDirtyChange,
  onFormClose,
  onOpenHankeDelete,
  children,
}) => {
  const [showNotification, setShowNotification] = useState<FormNotification | null>(null);
  const formContext = useForm<HankeDataFormState>({
    mode: 'all',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
    shouldUnregister: false,
    defaultValues: formData,
    resolver: yupResolver(hankeSchema),
  });

  const {
    register,
    formState: { errors, isDirty, isValid },
    getValues,
    reset,
  } = formContext;

  const hankeMutation = useMutation(saveHanke, {
    onMutate() {
      setShowNotification(null);
    },
    onError() {
      setShowNotification('error');
    },
    onSuccess() {
      setShowNotification('success');
    },
  });

  useEffect(() => {
    if (hankeMutation.data) {
      // Update form data with API response
      reset(hankeMutation.data);
    }
  }, [hankeMutation.data, reset]);

  const saveDraft = useCallback(() => {
    hankeMutation.mutate(getValues());
  }, [getValues, hankeMutation]);

  useEffect(() => {
    onIsDirtyChange(isDirty);
  }, [isDirty, onIsDirtyChange]);

  const formSteps = [
    {
      path: '/',
      element: <Form0 errors={errors} register={register} formData={formData} />,
      title: 'Perustiedot',
    },
    {
      path: '/yhteystiedot',
      element: <Form2 errors={errors} register={register} formData={formData} />,
      title: 'Yhteystiedot',
    },
    {
      path: '/alueet',
      element: <Form1 errors={errors} register={register} formData={formData} />,
      title: 'Aluetiedot',
    },
  ];

  return (
    <FormProvider {...formContext}>
      <FormNotifications showNotification={showNotification} />
      <div className="hankeForm">
        <Text tag="h1" data-testid="formPageHeader" styleAs="h2" spacing="s" weight="bold">
          &nbsp;
        </Text>

        <GenericForm
          showDelete={Boolean(formData.hankeTunnus)}
          isFormValid={isValid}
          formSteps={formSteps}
          onClose={onFormClose}
          onDelete={onOpenHankeDelete}
          onSave={saveDraft}
        />
      </div>
      {children}
    </FormProvider>
  );
};
export default HankeForm;
