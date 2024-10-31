import { useState } from 'react';
import useDebouncedMutation from '../../../../common/hooks/useDebouncedMutation';
import {
  JohtoselvitysData,
  JohtoselvitysUpdateData,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
} from '../../types/application';
import { modifyDataBeforeSend } from '../../utils';
import { updateTaydennys } from '../taydennysApi';
import { modifyTaydennysAfterReceive } from '../utils';

export default function useUpdateTaydennys<
  ApplicationData extends JohtoselvitysData | KaivuilmoitusData,
  UpdateData extends JohtoselvitysUpdateData | KaivuilmoitusUpdateData,
>() {
  const [showSaveNotification, setShowSaveNotification] = useState<boolean>(false);

  const taydennysUpdateMutation = useDebouncedMutation(
    ({ id, data }: { id: string; data: UpdateData }) =>
      updateTaydennys<ApplicationData, UpdateData>({ id, data: modifyDataBeforeSend(data) }),
    {
      onMutate() {
        setShowSaveNotification(false);
      },
      async onSuccess(data) {
        return modifyTaydennysAfterReceive(data);
      },
      onSettled() {
        setShowSaveNotification(true);
      },
    },
  );

  return {
    taydennysUpdateMutation,
    showSaveNotification,
    setShowSaveNotification,
  };
}
