import { useState } from 'react';
import {
  createApplication,
  modifyDataAfterReceive,
  modifyDataBeforeSend,
  updateApplication,
} from '../utils';
import {
  Application,
  JohtoselvitysCreateData,
  JohtoselvitysData,
  JohtoselvitysUpdateData,
  KaivuilmoitusCreateData,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
} from '../types/application';
import useDebouncedMutation from '../../../common/hooks/useDebouncedMutation';

type SuccessFunction<ApplicationData> = (data: Application<ApplicationData>) => void;

export default function useSaveApplication<
  ApplicationData extends JohtoselvitysData | KaivuilmoitusData,
  CreateData extends JohtoselvitysCreateData | KaivuilmoitusCreateData,
  UpdateData extends JohtoselvitysUpdateData | KaivuilmoitusUpdateData,
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

  const applicationCreateMutation = useDebouncedMutation(
    createApplication<ApplicationData, CreateData>,
    {
      onMutate() {
        setShowSaveNotification(null);
      },
      onSuccess: onCreateSuccess,
      onSettled() {
        setShowSaveNotification('create');
      },
    },
  );

  const applicationUpdateMutation = useDebouncedMutation(
    (data: { id: number; data: UpdateData }) =>
      updateApplication<ApplicationData, UpdateData>({
        id: data.id,
        data: modifyDataBeforeSend(data.data),
      }),
    {
      onMutate() {
        setShowSaveNotification(null);
      },
      onSuccess(application: Application<ApplicationData>) {
        const modifiedData = modifyDataAfterReceive(application);
        onUpdateSuccess(modifiedData);
      },
      onSettled() {
        setShowSaveNotification('update');
      },
    },
  );

  return {
    applicationCreateMutation,
    applicationUpdateMutation,
    showSaveNotification,
    setShowSaveNotification,
  };
}
