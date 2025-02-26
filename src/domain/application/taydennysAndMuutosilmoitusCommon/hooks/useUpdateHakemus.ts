import { useState } from 'react';
import { useQueryClient } from 'react-query';
import useDebouncedMutation from '../../../../common/hooks/useDebouncedMutation';
import {
  JohtoselvitysData,
  JohtoselvitysUpdateData,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
} from '../../types/application';
import { modifyDataBeforeSend } from '../../utils';
import { Muutosilmoitus } from '../../muutosilmoitus/types';
import { Taydennys } from '../../taydennys/types';
import { modifyHakemusAfterReceive } from '../utils';

type UpdateFunction<ApplicationData, UpdateData> = ({
  id,
  data,
}: {
  id: string;
  data: UpdateData;
}) => Promise<Taydennys<ApplicationData> | Muutosilmoitus<ApplicationData>>;

export default function useUpdateHakemus<
  ApplicationData extends JohtoselvitysData | KaivuilmoitusData,
  UpdateData extends JohtoselvitysUpdateData | KaivuilmoitusUpdateData,
>(
  applicationId: number | null,
  updateFunction: UpdateFunction<ApplicationData, UpdateData>,
  onUpdateSuccess?: (data: Taydennys<ApplicationData> | Muutosilmoitus<ApplicationData>) => void,
) {
  const queryClient = useQueryClient();
  const [showSaveNotification, setShowSaveNotification] = useState<boolean>(false);

  const hakemusUpdateMutation = useDebouncedMutation(
    ({ id, data }: { id: string; data: UpdateData }) =>
      updateFunction({ id, data: modifyDataBeforeSend(data) }),
    {
      onMutate() {
        setShowSaveNotification(false);
      },
      async onSuccess(data) {
        onUpdateSuccess?.(
          modifyHakemusAfterReceive(data) as
            | Taydennys<ApplicationData>
            | Muutosilmoitus<ApplicationData>,
        );
        await queryClient.invalidateQueries(['application', applicationId], {
          refetchInactive: true,
        });
        return data;
      },
      onSettled() {
        setShowSaveNotification(true);
      },
    },
  );

  return {
    hakemusUpdateMutation,
    showSaveNotification,
    setShowSaveNotification,
  };
}
