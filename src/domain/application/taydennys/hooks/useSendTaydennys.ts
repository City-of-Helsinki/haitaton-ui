import { useQueryClient } from 'react-query';
import { JohtoselvitysData, KaivuilmoitusData } from '../../types/application';
import useTaydennysSendNotification from './useTaydennysSendNotification';
import useDebouncedMutation from '../../../../common/hooks/useDebouncedMutation';
import { sendTaydennys } from '../taydennysApi';

export default function useSendTaydennys() {
  const queryClient = useQueryClient();
  const { showSendSuccess, showSendError } = useTaydennysSendNotification();

  return useDebouncedMutation(
    (id: string) => sendTaydennys<JohtoselvitysData | KaivuilmoitusData>(id),
    {
      onError() {
        showSendError();
      },
      async onSuccess(data) {
        showSendSuccess();
        await queryClient.invalidateQueries(['application', data.id], { refetchInactive: true });
      },
    },
  );
}
