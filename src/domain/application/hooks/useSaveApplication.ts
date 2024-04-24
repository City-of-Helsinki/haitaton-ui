import { useState } from 'react';
import { useMutation } from 'react-query';
import { createApplication, updateApplication } from '../utils';
import { Application, JohtoselvitysData, KaivuilmoitusData } from '../types/application';

type SuccessFunction<ApplicationData> = (data: Application<ApplicationData>) => void;

export default function useSaveApplication<
  ApplicationData extends JohtoselvitysData | KaivuilmoitusData,
  CreateData,
  UpdateData,
>({
  onCreateSuccess,
  onUpdateSuccess,
}: {
  onCreateSuccess: SuccessFunction<ApplicationData>;
  onUpdateSuccess: SuccessFunction<ApplicationData>;
}) {
  const [showSaveNotification, setShowSaveNotification] = useState<'create' | 'update' | null>(
    null,
  );

  const applicationCreateMutation = useMutation(createApplication<ApplicationData, CreateData>, {
    onMutate() {
      setShowSaveNotification(null);
    },
    onSuccess: onCreateSuccess,
    onSettled() {
      setShowSaveNotification('create');
    },
  });

  const applicationUpdateMutation = useMutation(updateApplication<ApplicationData, UpdateData>, {
    onMutate() {
      setShowSaveNotification(null);
    },
    onSuccess: onUpdateSuccess,
    onSettled() {
      setShowSaveNotification('update');
    },
  });

  return {
    applicationCreateMutation,
    applicationUpdateMutation,
    showSaveNotification,
    setShowSaveNotification,
  };
}
